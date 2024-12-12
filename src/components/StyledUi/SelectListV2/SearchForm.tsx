import React, { FormEvent, useState, useEffect } from 'react';
import { SearchFormContainer, SearchFormContainerProps } from './SearchForm.elements';

interface Props extends SearchFormContainerProps {
  handleSubmit?: (data?: string) => void;
  placeHolder?: string;
  data?: Record<string, unknown>[];
}

export interface HandleFormSubmitReturnProps {
  [key: string]: string;
}

const SuggestedItem = ({
  item,
  handleClick
}: {
  item: string;
  handleClick: (x: string) => void;
}) => {
  return (
    <div className="search-form-suggested__item" onClick={() => handleClick(item)}>
      {item}
    </div>
  );
};

const SuggestedDropdown = ({
  suggested,
  handleClick
}: {
  suggested?: string[];
  handleClick: (val: string) => void;
}) => {
  let className = `search-form-suggested`;

  if (suggested?.length == 0) className = `${className} ${className}--is-closed`;

  const Items = suggested?.map((item) => <SuggestedItem key={item} {...{ item, handleClick }} />);

  return <div className={className}>{Items}</div>;
};

export const SearchForm = ({ handleSubmit, data, placeHolder }: Props): JSX.Element => {
  const [suggested, setSuggested] = useState<string[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  placeHolder = placeHolder || `Enter Search Term`;

  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit?.(searchTerm);
  };

  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      const newSuggested = data?.reduce((acc: string[], item) => {
        Object.values(item).forEach((value) => {
          const match =
            `${value}` === searchTerm
              ? false
              : `${value}`.toLowerCase().includes(searchTerm.toLowerCase());
          if (match && !acc.includes(value as string)) acc = [...acc, value as string];
        });
        return acc;
      }, []);
      setSuggested(newSuggested);
    } else {
      if (suggested) setSuggested(undefined);
    }
  }, [searchTerm]);

  return (
    <SearchFormContainer>
      <form onSubmit={(e) => handle(e)}>
        <label className="data-filter-search__label">{placeHolder}</label>
        <input
          name="searchTerm"
          type="text"
          id="searchTerm"
          className="data-filter-search__input"
          onChange={(e) => setSearchTerm(sanitizeTextInput(e.target.value as string))}
          value={searchTerm}
        />
        <input type="submit" id="searchSubmitBtn" className="data-filter-search__btn" />
        <SuggestedDropdown {...{ suggested, handleClick: (x) => setSearchTerm(x) }} />
      </form>
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
