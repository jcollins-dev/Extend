export interface AriaProps {
  isAriaHidden?: boolean; // html - aria-hidden=true for ux
  htmlHide?: boolean; // html - adds hidden tag to element to hide from browser flow
  isLoading?: boolean; // html - aria-busy=true for ux
  isDisabled?: boolean; // html - tells browser item is disabled
  ariaLabel?: string; // html - aria-label for ux
  ariaGroup?: string; // html - aria-group for ux
  isMuted?: string;
}

export interface ContainerProps extends AriaProps {
  ga?: string; // css - grid-area
}

export interface TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface HeadlineProps {
  styleType?: 'page-headline' | 'tile-headline' | 'section-headline' | 'popup-headline';
}

export interface TextProps {
  styleType?: 'time-label' | 'label';
}

export interface StatusProps {
  isLoading?: boolean;
  hasError?: string;
}

export interface AlertTypeProps {
  /**
   * error alert is color.error, warning is color.warning.  defaults to error but can by changed
   * via styled components.
   */
  alertType?: 'error' | 'warning';
}
