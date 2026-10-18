import { useState, type FormEvent } from 'react';
import { useIsMobile } from './use-mobile';

export const MOBILE_FORM_SUCCESS = "Sent! We'll be in touch.";
export const MOBILE_FORM_FAILURE = 'Something went wrong, please try again or email us.';
export const sentenceCase = (label: string) => label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

/** Keep desktop validation unchanged; give mobile forms accessible inline errors. */
export function useMobileForm() {
  const mobile = useIsMobile();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: HTMLFormElement) {
    if (!mobile) return true;
    const controls = [...form.elements].filter(
      (element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
        element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement,
    );
    const invalid = controls.find((field) =>
      field.willValidate && (!field.validity.valid || (field.required && !field.value.trim())),
    );
    if (!invalid) {
      setErrors({});
      return true;
    }
    const message = invalid instanceof HTMLInputElement && invalid.type === 'checkbox'
      ? 'Choose at least one product.'
      : invalid.validity.valueMissing || (invalid.required && !invalid.value.trim())
        ? 'Please fill out this field.'
        : invalid.validity.typeMismatch
          ? 'Enter a valid email address.'
          : invalid.validity.rangeUnderflow
            ? `Enter ${invalid.getAttribute('min') || '1'} or more.`
            : 'Please enter a valid value.';
    setErrors({ [invalid.id]: message });
    requestAnimationFrame(() => {
      invalid.focus({ preventScroll: true });
      invalid.scrollIntoView({
        block: 'center',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
    return false;
  }

  function clear(event: FormEvent<HTMLFormElement>) {
    const field = event.target as HTMLInputElement;
    const id = field.type === 'checkbox'
      ? field.closest('fieldset')?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.id || field.id
      : field.id;
    if (errors[id]) setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  return {
    mobile,
    validate,
    clear,
    reset: () => setErrors({}),
    field: (id: string) => ({
      id,
      'aria-invalid': mobile && !!errors[id] || undefined,
      'aria-describedby': mobile && errors[id] ? `${id}-error` : undefined,
    }),
    error: (id: string) => mobile && errors[id]
      ? <p id={`${id}-error`} role="alert" className="mobile-field-error">{errors[id]}</p>
      : null,
  };
}
