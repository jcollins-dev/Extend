import React, { FormEvent, useState, useEffect, useMemo, useRef, RefObject } from 'react';
import { SearchFormContainer, SearchFormContainerProps, baseClass } from './SearchForm.elements';
import { IconSearch } from 'icons/IconSearch';
import { IconX } from 'icons/IconX';
import { useClickOutside } from 'hooks/useClickOutside';

interface Props extends SearchFormContainerProps {
  handleSubmit?: (data?: string) => void;
  placeHolder?: string;
  data?: Record<string, unknown>[];
  clear?: unknown;
  hasSuggestions?: boolean;
  isLoading?: boolean;
  handleClear?: () => void;
}

export interface HandleFormSubmitReturnProps {
  [key: string]: string;
}

const RefUser = (ref: RefObject<HTMLDivElement>, cb: () => void) =>
  useClickOutside(ref, () => cb());

const SuggestedDropdown = ({
  suggested,
  handleClick
}: {
  suggested?: string[];
  handleClick: (val: string) => void;
}) => {
  const listRef = useRef(null);

  const [open, setOpen] = useState(suggested ? true : false);

  useEffect(() => {
    if (suggested?.length == 0) {
      if (open) setOpen(false);
    } else {
      setOpen(true);
    }
  }, [suggested]);

  if (listRef) RefUser(listRef, () => setOpen(false));

  if (!suggested) return <></>;

  let className = `${baseClass}__suggested`;

  if (!open) {
    className = `${className} ${className}--is-closed`;
    return <></>;
  }

  const Items = suggested?.map((item) => (
    <div className={`${baseClass}__suggested__item`} onClick={() => handleClick(item)} key={item}>
      {item}
    </div>
  ));

  return (
    <div className={className} ref={listRef}>
      {Items}
    </div>
  );
};

export const SearchForm = ({
  handleSubmit,
  data,
  //placeHolder,
  clear,
  hasSuggestions,
  isLoading,
  handleClear
}: Props): JSX.Element => {
  if (!handleSubmit) console.warn(`Error in SearchForm: missing handleSubmit function`);

  const dataCache = useMemo(() => data, [data]);

  const [suggested, setSuggested] = useState<string[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm) return false;
    else {
      handleSubmit?.(searchTerm);
      setSuggested(undefined);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm(undefined);
    hasSuggestions && handleSubmit?.(undefined);
    return handleClear?.();
  };

  useEffect(() => {
    // does this search form have the suggestions dropdown to click?
    if (hasSuggestions) {
      // only run if text has been entered in the search box
      if (searchTerm && searchTerm.length > 1) {
        // build a list of suggested terms based on the users input by looping through
        // the data array and search each key by string
        const newSuggested = dataCache?.reduce((acc: string[], item) => {
          Object.values(item).forEach((value) => {
            const match =
              `${value}` === searchTerm
                ? false
                : `${value}`.toLowerCase().includes(searchTerm.toLowerCase());

            if (match && !acc.includes(value as string)) acc = [...acc, value as string];
          });
          return acc;
        }, []);

        // sets the suggested search terms to show user in dropdown
        setSuggested(newSuggested);
      } else {
        // no suggestions found, clear the box
        if (suggested) setSuggested(undefined);
      }
    }
  }, [searchTerm]);

  // externally clear the search box
  useEffect(() => {
    if (searchTerm && clear) setSearchTerm(undefined);
  }, [clear]);

  return (
    <SearchFormContainer onSubmit={(e) => handle(e)} className={`${baseClass}`}>
      <IconSearch />
      <input
        disabled={isLoading ? true : undefined}
        autoComplete="off"
        name="searchTerm"
        type="text"
        id="searchTerm"
        className={`${baseClass}__input`}
        onChange={(e) => setSearchTerm(sanitizeTextInput(e.target.value as string))}
        value={searchTerm || ''}
      />
      <div
        className={`${baseClass}__cancel${!searchTerm ? `${baseClass}__cancel--is-hidden` : ``}`}
        onClick={() => handleClearSearch()}
      >
        {searchTerm && (
          <>
            <IconX />
            <span className="sr-only">close</span>
          </>
        )}
      </div>
      {hasSuggestions && (
        <SuggestedDropdown
          {...{
            suggested,
            handleClick: (x) => {
              setSearchTerm(x);
              return handleSubmit?.(x);
            }
          }}
        />
      )}
    </SearchFormContainer>
  );
};

export const sanitizeTextInput = (val: string): string => {
  // Remove any HTML tags
  const sanitizedInput = val.replace(/<[^>]+>/g, '');
  // Remove any JavaScript code
  const regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  // cleaned
  return sanitizedInput.replace(regex, '');
};

/** A function that extracts the form data and returns an object with key-value pairs. */
export const getFormValues = (event: FormEvent<HTMLFormElement>): HandleFormSubmitReturnProps => {
  event.preventDefault();
  // Extract the form element from the event using the `target` property and a type assertion.
  const form = event.target as HTMLFormElement;

  // Create a new object from the form element.
  const formData = new FormData(form);

  // Extract the form data and return an object with key-value pairs.
  return Array.from(formData.entries()).reduce(
    (formValues: HandleFormSubmitReturnProps, [key, value]) => {
      // Set the `key` property on the `formValues` object to the `value`
      // also, sanitize the input by removing and js or html code
      formValues[key] = sanitizeTextInput(value as string);
      return formValues;
    },
    {}
  );
};
