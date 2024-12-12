import React, { ReactElement } from 'react';
import styled from 'styled-components';

export { IcoChevRight } from './IcoChevRight';
export * from './IcoPencil';
export { IcoWarning } from './IcoWarning';

export const BillOfMaterialsIcon = (color?: string): ReactElement => {
  return (
    <svg
      version="1.1"
      id="icon-_x2F_-bill-of-materials"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100%"
      height="100%"
      viewBox="0 0 16 16"
    >
      <g>
        <g id="truck-loading-solid" transform="translate(0.000000, 2.000000)">
          <defs>
            <filter
              id="Adobe_OpacityMaskFilter"
              filterUnits="userSpaceOnUse"
              x="0"
              y="-2"
              width="16"
              height="16"
            >
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            </filter>
          </defs>

          <mask
            maskUnits="userSpaceOnUse"
            x="0"
            y="-2"
            width="16"
            height="16"
            id="mask-2_00000016787089941397438520000002716642435760278172_"
          >
            <g style={{ filter: 'url(#Adobe_OpacityMaskFilter)' }}>
              <path
                id="path-1_00000026843302856019712580000006793720169879370665_"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#FFFFFF"
                d="
					M1.3,9.5c0.1,0.2,0.3,0.3,0.5,0.3l5.4-1.5c0.2-0.1,0.3-0.3,0.3-0.5L6.2,3.1C6.1,2.9,5.9,2.8,5.7,2.9L3.8,3.4l0.6,2.4L2.9,6.2
					L2.2,3.8L0.3,4.3C0.1,4.4,0,4.6,0,4.8L1.3,9.5z M9.6,0C9.2,0,8.8,0.4,8.8,0.8V9l-8.7,2.4C0,11.5,0,11.6,0,11.7l0.3,1.2
					C0.4,13,0.5,13,0.6,13l9.8-2.7c0.1,1.5,1.3,2.7,2.8,2.7c1.5,0,2.8-1.3,2.8-2.8V0H9.6z M13.2,11.4c-0.7,0-1.2-0.5-1.2-1.2
					c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2C14.4,10.8,13.9,11.4,13.2,11.4z"
              />
            </g>
          </mask>

          <rect
            id="BOMRectangle"
            y="-2"
            mask="url(#mask-2_00000016787089941397438520000002716642435760278172_)"
            fillRule="evenodd"
            clipRule="evenodd"
            fill={color ? color : '#000000'}
            width="16"
            height="16"
          />
        </g>
      </g>
    </svg>
  );
};

export const EngineIcon = (color?: string): ReactElement => {
  return (
    <svg
      id="EnginePath"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2571_429)">
        <path
          d="M3 5C3 4.73478 3.10536 4.48043 3.29289 4.29289C3.48043 4.10536 3.73478 4 4 4H20C20.2652 4 20.5196 4.10536 20.7071 4.29289C20.8946 4.48043 21 4.73478 21 5V15C21 15.2652 20.8946 15.5196 20.7071 15.7071C20.5196 15.8946 20.2652 16 20 16H4C3.73478 16 3.48043 15.8946 3.29289 15.7071C3.10536 15.5196 3 15.2652 3 15V5Z"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 20H17"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 16V20"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 16V20"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 12V8"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12V11"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 12V10"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12V11"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2571_429">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const PartsIcon = (color?: string): ReactElement => {
  return (
    <svg
      id="PartsMask"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.26437 3.41578C8.39898 3.49233 8.51076 3.60338 8.58821 3.73747C8.66565 3.87157 8.70596 4.02389 8.705 4.17874V7.03163C8.705 7.34849 8.53149 7.64067 8.25145 7.79459L5.60771 9.467C5.47664 9.53896 5.32954 9.57669 5.18001 9.57669C5.03049 9.57669 4.88338 9.53896 4.75232 9.467L2.10858 7.79459C1.97156 7.71971 1.85718 7.6094 1.77739 7.47518C1.6976 7.34096 1.65534 7.18777 1.65503 7.03163V4.17835C1.65503 3.86149 1.82854 3.5697 2.10858 3.41578L4.75232 1.85695C4.88726 1.78255 5.03884 1.74353 5.19294 1.74353C5.34703 1.74353 5.49862 1.78255 5.63356 1.85695L8.2773 3.41578H8.26437Z"
        stroke={color ? color : '#000000'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.00513 5.65998C4.00513 5.97161 4.12892 6.27047 4.34927 6.49083C4.56963 6.71118 4.86849 6.83497 5.18012 6.83497C5.49175 6.83497 5.79061 6.71118 6.01097 6.49083C6.23132 6.27047 6.35512 5.97161 6.35512 5.65998C6.35512 5.34835 6.23132 5.04949 6.01097 4.82913C5.79061 4.60878 5.49175 4.48499 5.18012 4.48499C4.86849 4.48499 4.56963 4.60878 4.34927 4.82913C4.12892 5.04949 4.00513 5.34835 4.00513 5.65998Z"
        stroke={color ? color : '#000000'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3751 13.3932H13.8532V10.915L10.962 8.02387C11.8869 7.58216 12.926 7.43804 13.9361 7.61136C14.9463 7.78468 15.8779 8.26691 16.6026 8.99164C17.3274 9.71638 17.8096 10.648 17.9829 11.6581C18.1562 12.6683 18.0121 13.7074 17.5704 14.6322L22.5267 19.5885C22.8553 19.9172 23.0399 20.3629 23.0399 20.8276C23.0399 21.2923 22.8553 21.738 22.5267 22.0667C22.1981 22.3953 21.7524 22.5799 21.2876 22.5799C20.8229 22.5799 20.3772 22.3953 20.0486 22.0667L15.0923 17.1104C14.1674 17.5521 13.1283 17.6962 12.1182 17.5229C11.108 17.3496 10.1764 16.8673 9.45167 16.1426C8.72693 15.4179 8.2447 14.4863 8.07138 13.4761C7.89806 12.4659 8.04218 11.4269 8.48389 10.502L11.3751 13.3932Z"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MaintenanceIcon = (color?: string): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.0895 20.2316H5.10257C4.5733 20.2316 4.0657 20.0213 3.69144 19.6471C3.31719 19.2728 3.10693 18.7652 3.10693 18.236V6.26212C3.10693 5.73284 3.31719 5.22524 3.69144 4.85099C4.0657 4.47673 4.5733 4.26648 5.10257 4.26648H17.0764C17.6057 4.26648 18.1133 4.47673 18.4875 4.85099C18.8618 5.22524 19.0721 5.73284 19.0721 6.26212V11.2512"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0808 2.27087V6.26215"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.0979 2.27087V6.26215"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.10693 10.2534H19.0721"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0175 13.9894C16.1881 13.2868 17.1872 13.2868 17.3578 13.9894C17.468 14.4432 17.9879 14.6586 18.3868 14.4156C19.0042 14.0394 19.7107 14.7459 19.3345 15.3633C19.0915 15.7622 19.3069 16.2821 19.7607 16.3923C20.4633 16.5629 20.4633 17.5621 19.7607 17.7326C19.3069 17.8428 19.0915 18.3628 19.3345 18.7616C19.7107 19.379 19.0042 20.0855 18.3868 19.7093C17.9879 19.4663 17.468 19.6817 17.3578 20.1355C17.1872 20.8381 16.1881 20.8381 16.0175 20.1355C15.9073 19.6817 15.3873 19.4663 14.9885 19.7093C14.3711 20.0855 13.6646 19.379 14.0408 18.7616C14.2838 18.3628 14.0684 17.8428 13.6146 17.7326C12.912 17.5621 12.912 16.5629 13.6146 16.3923C14.0684 16.2821 14.2838 15.7622 14.0408 15.3633C13.6646 14.7459 14.3711 14.0394 14.9885 14.4156C15.3873 14.6586 15.9073 14.4432 16.0175 13.9894Z"
        stroke={color ? color : '#000000'}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.8876 17.0625C17.8876 17.7252 17.3504 18.2625 16.6876 18.2625C16.0249 18.2625 15.4876 17.7252 15.4876 17.0625C15.4876 16.3997 16.0249 15.8625 16.6876 15.8625C17.3504 15.8625 17.8876 16.3997 17.8876 17.0625Z"
        stroke={color ? color : '#000000'}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserShieldIcon = (color?: string): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.31055 5.45381C5.31055 6.64563 5.784 7.78865 6.62675 8.63139C7.46949 9.47414 8.6125 9.94759 9.80433 9.94759C10.9962 9.94759 12.1392 9.47414 12.9819 8.63139C13.8247 7.78865 14.2981 6.64563 14.2981 5.45381C14.2981 4.26198 13.8247 3.11897 12.9819 2.27622C12.1392 1.43347 10.9962 0.960022 9.80433 0.960022C8.6125 0.960022 7.46949 1.43347 6.62675 2.27622C5.784 3.11897 5.31055 4.26198 5.31055 5.45381Z"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.06348 21.1821V18.9352C3.06348 17.7434 3.53693 16.6004 4.37967 15.7576C5.22242 14.9149 6.36543 14.4414 7.55726 14.4414H10.3659"
        stroke={color ? color : '#000000'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.0177 14.9894C17.1883 14.2868 18.1875 14.2868 18.358 14.9894C18.4682 15.4432 18.9882 15.6586 19.387 15.4156C20.0044 15.0394 20.7109 15.7459 20.3348 16.3633C20.0917 16.7622 20.3071 17.2821 20.761 17.3923C21.4635 17.5629 21.4635 18.5621 20.761 18.7326C20.3071 18.8428 20.0917 19.3628 20.3348 19.7616C20.7109 20.379 20.0044 21.0855 19.387 20.7093C18.9882 20.4663 18.4682 20.6817 18.358 21.1355C18.1875 21.8381 17.1883 21.8381 17.0177 21.1355C16.9076 20.6817 16.3876 20.4663 15.9888 20.7093C15.3714 21.0855 14.6648 20.379 15.041 19.7616C15.284 19.3628 15.0687 18.8428 14.6148 18.7326C13.9122 18.5621 13.9122 17.5629 14.6148 17.3923C15.0687 17.2821 15.284 16.7622 15.041 16.3633C14.6648 15.7459 15.3714 15.0394 15.9888 15.4156C16.3876 15.6586 16.9076 15.4432 17.0177 14.9894Z"
        stroke={color ? color : '#000000'}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8879 18.0625C18.8879 18.7252 18.3506 19.2625 17.6879 19.2625C17.0251 19.2625 16.4879 18.7252 16.4879 18.0625C16.4879 17.3997 17.0251 16.8625 17.6879 16.8625C18.3506 16.8625 18.8879 17.3997 18.8879 18.0625Z"
        stroke={color ? color : '#000000'}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HelpIcon = (color?: string): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2270_484)">
        <path
          d="M3 12C3 13.1819 3.23279 14.3522 3.68508 15.4442C4.13738 16.5361 4.80031 17.5282 5.63604 18.364C6.47177 19.1997 7.46392 19.8626 8.55585 20.3149C9.64778 20.7672 10.8181 21 12 21C13.1819 21 14.3522 20.7672 15.4442 20.3149C16.5361 19.8626 17.5282 19.1997 18.364 18.364C19.1997 17.5282 19.8626 16.5361 20.3149 15.4442C20.7672 14.3522 21 13.1819 21 12C21 10.8181 20.7672 9.64778 20.3149 8.55585C19.8626 7.46392 19.1997 6.47177 18.364 5.63604C17.5282 4.80031 16.5361 4.13738 15.4442 3.68508C14.3522 3.23279 13.1819 3 12 3C10.8181 3 9.64778 3.23279 8.55585 3.68508C7.46392 4.13738 6.47177 4.80031 5.63604 5.63604C4.80031 6.47177 4.13738 7.46392 3.68508 8.55585C3.23279 9.64778 3 10.8181 3 12Z"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17V17.01"
          stroke={color ? color : '#000000'}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13.5C11.9816 13.1754 12.0692 12.8535 12.2495 12.583C12.4299 12.3125 12.6933 12.1078 13 12C13.3759 11.8562 13.7132 11.6272 13.9856 11.3309C14.2579 11.0347 14.4577 10.6792 14.5693 10.2926C14.6809 9.90594 14.7013 9.49868 14.6287 9.10285C14.5562 8.70702 14.3928 8.33343 14.1513 8.0115C13.9099 7.68956 13.597 7.42807 13.2373 7.2476C12.8776 7.06713 12.4809 6.97262 12.0785 6.97151C11.6761 6.97039 11.2789 7.0627 10.9182 7.24117C10.5576 7.41964 10.2432 7.67939 10 7.99998"
          stroke={color ? color : '#000000'}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2270_484">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const MachineManagementIcon = (color?: string): ReactElement => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.0175 12.1869C19.1881 11.4843 20.1872 11.4843 20.3578 12.1869C20.468 12.6407 20.9879 12.8561 21.3868 12.6131C22.0042 12.2369 22.7107 12.9435 22.3345 13.5608C22.0915 13.9597 22.3069 14.4796 22.7607 14.5898C23.4633 14.7604 23.4633 15.7596 22.7607 15.9301C22.3069 16.0403 22.0915 16.5603 22.3345 16.9591C22.7107 17.5765 22.0042 18.283 21.3868 17.9068C20.9879 17.6638 20.468 17.8792 20.3578 18.333C20.1872 19.0356 19.1881 19.0356 19.0175 18.333C18.9073 17.8792 18.3873 17.6638 17.9885 17.9068C17.3711 18.283 16.6646 17.5765 17.0408 16.9591C17.2838 16.5603 17.0684 16.0403 16.6146 15.9301C15.912 15.7596 15.912 14.7604 16.6146 14.5898C17.0684 14.4796 17.2838 13.9597 17.0408 13.5608C16.6646 12.9435 17.3711 12.2369 17.9885 12.6131C18.3873 12.8561 18.9073 12.6407 19.0175 12.1869Z"
        stroke={color ? color : '#000000'}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.8876 15.26C20.8876 15.9227 20.3504 16.46 19.6876 16.46C19.0249 16.46 18.4876 15.9227 18.4876 15.26C18.4876 14.5972 19.0249 14.06 19.6876 14.06C20.3504 14.06 20.8876 14.5972 20.8876 15.26Z"
        stroke={color ? color : '#000000'}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <mask
        id="mask0_2571_463"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="1"
        y="2"
        width="20"
        height="20"
      >
        <path
          d="M8.49998 16.803L7.77554 19.7008L6.80961 20.6667H14.537L13.5711 19.7008L12.8466 16.803M1.97998 12.9393H19.3666M3.91183 16.803H17.4348C18.5017 16.803 19.3666 15.9381 19.3666 14.8711V5.21188C19.3666 4.14495 18.5017 3.28003 17.4348 3.28003H3.91183C2.8449 3.28003 1.97998 4.14495 1.97998 5.21188V14.8711C1.97998 15.9381 2.8449 16.803 3.91183 16.803Z"
          stroke={color ? color : '#000000'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_2571_463)">
        <path
          d="M1.01416 0.382263H24.6793V10.0415H14.5371V17.7689L15.503 18.7349V21.6326H1.01416V0.382263Z"
          fill={color ? color : '#000000'}
        />
      </g>
    </svg>
  );
};

export const UpgradeIcon = (color?: string): ReactElement => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>icon / upgrade</title>
      <defs>
        <path
          d="M9.22493413,2.2087117 C9.95075763,2.36149412 10.6273655,2.64737271 11.2286521,3.03938587 L12.7909272,1.47711072 L14.5228893,3.20928677 L12.9606141,4.77156193 C13.3528413,5.37284849 13.6387199,6.04945635 13.7915023,6.77527985 L16,6.77527985 L16,9.22493413 L13.7917163,9.22493413 C13.6387199,9.95075763 13.3530552,10.6275795 12.9608281,11.2286521 L14.5228893,12.7909272 L12.7907132,14.5228893 L11.2286521,12.9608281 C10.6273655,13.3528413 9.95075763,13.6387199 9.22493413,13.7915023 L9.22493413,16 L6.77506587,16 L6.77506587,13.7917163 C6.04924237,13.6387199 5.37263451,13.3530552 4.77134795,12.9608281 L3.20928677,14.5228893 L1.47711072,12.7907132 L3.03938587,11.2284381 C2.64715873,10.6273655 2.36128014,9.95075763 2.20849772,9.22472015 L0,9.22472015 L0,6.77506587 L2.20849772,6.77506587 C2.36128014,6.04924237 2.64715873,5.37242053 3.03917189,4.77134795 L1.47711072,3.20928677 L3.20928677,1.47711072 L4.77156193,3.03938587 C5.37263451,2.64715873 6.04945635,2.36128014 6.77527985,2.20849772 L6.77527985,0 L9.22493413,0 L9.22493413,2.2087117 Z M8.74081114,7.61104626 L8.74081114,11.2209703 C8.74081114,12.2596766 7.25930861,12.2596766 7.25930861,11.2209703 L7.25930861,7.61030033 L6.08477621,7.60974088 C5.59362401,7.60992737 5.31289065,6.98595765 5.64294913,6.5792398 L7.55228579,4.22173079 C7.78246966,3.93025898 8.20558118,3.92429155 8.44136222,4.21483095 L10.3269109,6.5434352 C10.693351,6.9307589 10.4413032,7.61160571 9.91429407,7.61160571 L8.74081114,7.61104626 L8.74081114,7.61104626 Z"
          id="upgrade-path-1"
        ></path>
      </defs>
      <g id="icon-/-upgrade" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="UpgradeRectangle">
          <mask id="upgrade-mask-2" fill="white">
            <use href="#upgrade-path-1"></use>
          </mask>
          <use id="UpgradeMask" fill={color ? color : '#000000'} href="#upgrade-path-1"></use>
          <rect
            fill={color ? color : '#000000'}
            mask="url(#upgrade-mask-2)"
            x="0"
            y="0"
            width="16"
            height="16"
          ></rect>
        </g>
      </g>
    </svg>
  );
};

export const UserGuideIcon = (color?: string): ReactElement => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 16 16"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>icon / userguide</title>
      <defs>
        <path
          d="M14,11.2685033 L14,0.751233553 C14,0.334924959 13.665625,0 13.25,0 L3,0 C1.34375,0 0,1.34596012 0,3.00493421 L0,13.0213816 C0,14.6803557 1.34375,16.0263158 3,16.0263158 L13.25,16.0263158 C13.665625,16.0263158 14,15.6913908 14,15.2750822 L14,14.7742599 C14,14.5394994 13.890625,14.3266499 13.721875,14.1889237 C13.590625,13.7068822 13.590625,12.3327508 13.721875,11.8507093 C13.890625,11.7161133 14,11.5032638 14,11.2685033 Z M12,14.0230263 L3.00819156,14.0230263 C2.4505356,14.0230263 2,13.5754163 2,13.0213816 C2,12.470477 2.4536862,12.0197368 3.00819156,12.0197368 L12,12.0197368 C11.9401386,12.5549907 11.9401386,13.4877724 12,14.0230263 Z"
          id="userguide-path-1"
        ></path>
        <rect
          x="2.02631579"
          y="2.21052632"
          width="9.76315789"
          height="7.55263158"
          id="rect-3"
        ></rect>
      </defs>
      <g id="icon-/-userguide" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Bitmap-+-Rectangle-Mask" transform="translate(1.000000, -0.000000)">
          <mask id="userguide-mask-2" fill="white">
            <use href="#userguide-path-1"></use>
          </mask>
          <use id="UserGuideMask" fill="#828285" fillRule="nonzero" href="#userguide-path-1"></use>
          <rect
            id="UserGuideRectangle"
            fill={color ? color : '#000000'}
            mask="url(#userguide-mask-2)"
            x="-1"
            y="0"
            width="16"
            height="16"
          ></rect>
          <g id="Bitmap" mask="url(#userguide-mask-2)">
            <image
              x="2.02631579"
              y="2.21052632"
              width="9.76315789"
              height="7.55263158"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABYCAYAAADC3RguAAAKumlDQ1BJQ0MgUHJvZmlsZQAASImVlwdUk8kWx+f7vnQSWkIEpITeewcpIbRQBOlgIySBhBJDQlCwobK4gmtBRASVBV0VUXBViqwFsWBhUex9gywq6rpYsKHmfcgj7L533nvn/XMm8zs3d+69M2fmnBsAyB84YnEOrA5ArihfEhsayEhOSWXghwAEYEBFPzocrlTMjImJBKgm57/r3U3UG9U1u/FY//77f5UGjy/lAgDFoJzOk3JzUT6CDjlXLMkHAKlE7SYL88Xj3IEyTYIWiHLvOGdOsHyc0yf47Tef+FgWABgCAAQyhyPJBIBMQ+2MAm4mGofsirKjiCcUocxD2Y8r4KAzeRfKtrm5C8b5CsqW6X+Jk/m3mOnKmBxOppIn9vJNhCChVJzDKfw/j+N/KzdHNpnDHB1kgSQsdjwfema3sxdEKFmUPjN6koW8iZrGWSALS5hkrpSVOsk8TlCEcm3OzMhJzhCGsJVx8tnxk8yXBsdNsmRBrDJXhoTFnGSOZCqvLDtBaRfw2cr4RYL4pEkuECbOnGRpdlzElA9LaZfIYpX180WhgVN5Q5R7z5X+Zb9CtnJtviA+TLl3zlT9fBFzKqY0WVkbjx8UPOWToPQX5wcqc4lzYpT+/JxQpV1aEKdcm49eyKm1McozzOKEx0wyEIIowAHcfP6i/PHiWQvEhRJhpiCfwURfFZ/BFnHtbRnOjs5OAIy/0Ykr8Ib+7e1B9ItTtlVGAPgWKhSKY1O2CPQ+Hz4OAOnulM1iCADViwCc38KVSQombJjxLywgATVAAzrAAJgAS2AHnIE78AEBIBiEg2gQD1LAPMAFApALJGAhWAJWgFJQDjaAzaAG1IGdYC84AA6BdnAMnALnwCVwBdwA94AcDIHnYAS8A2MQBOEhCkSFdCBDyAyygZwhT8gPCoYioVgoBUqDMiERJIOWQKugcqgCqoHqoUboZ+godAq6APVDd6ABaBh6DX2CEZgM02B92Bx2gD1hJhwBx8Nz4Uw4Dy6CS+B1cDXcAO+H2+BT8CX4BiyHn8OjCEBUEDpihNghnggLiUZSkQxEgixDypAqpAFpRjqRHuQaIkdeIB8xOAwVw8DYYXwwYZgEDBeTh1mGWYupwezFtGHOYK5hBjAjmK9YClYPa4P1xrKxydhM7EJsKbYKuxvbij2LvYEdwr7D4XB0nAXOAxeGS8Fl4Rbj1uK241pwXbh+3CBuFI/H6+Bt8L74aDwHn48vxW/F78efxF/FD+E/EFQIhgRnQgghlSAirCRUEfYRThCuEp4QxojqRDOiNzGayCMWEtcTdxE7iZeJQ8QxkgbJguRLiidlkVaQqknNpLOk+6Q3KioqxipeKrNUhCrFKtUqB1XOqwyofCRrkq3JLPIcsoy8jryH3EW+Q35DoVDMKQGUVEo+ZR2lkXKa8pDyQZWqaq/KVuWpLletVW1Tvar6Uo2oZqbGVJunVqRWpXZY7bLaC3Wiurk6S52jvky9Vv2o+i31UQ2qhpNGtEauxlqNfRoXNJ5q4jXNNYM1eZolmjs1T2sOUhGqCZVF5VJXUXdRz1KHaDiaBY1Ny6KV0w7Q+mgjWpparlqJWou0arWOa8npCN2czqbn0NfTD9Fv0j9N05/GnMaftmZa87Sr095rT9cO0OZrl2m3aN/Q/qTD0AnWydbZqNOu80AXo2utO0t3oe4O3bO6L6bTpvtM504vm35o+l09WM9aL1Zvsd5OvV69UX0D/VB9sf5W/dP6LwzoBgEGWQaVBicMhg2phn6GQsNKw5OGzxhaDCYjh1HNOMMYMdIzCjOSGdUb9RmNGVsYJxivNG4xfmBCMvE0yTCpNOk2GTE1NI0yXWLaZHrXjGjmaSYw22LWY/be3MI8yXy1ebv5UwttC7ZFkUWTxX1LiqW/ZZ5lg+V1K5yVp1W21XarK9awtZu1wLrW+rINbONuI7TZbtNvi7X1shXZNtjesiPbMe0K7JrsBuzp9pH2K+3b7V86mDqkOmx06HH46ujmmOO4y/Gek6ZTuNNKp06n187WzlznWufrLhSXEJflLh0ur1xtXPmuO1xvu1HdotxWu3W7fXH3cJe4N7sPe5h6pHls87jlSfOM8Vzred4L6xXotdzrmNdHb3fvfO9D3n/62Plk++zzeTrDYgZ/xq4Zg77Gvhzfel+5H8Mvze9HP7m/kT/Hv8H/UYBJAC9gd8ATphUzi7mf+TLQMVAS2Br4nuXNWsrqCkKCQoPKgvqCNYMTgmuCH4YYh2SGNIWMhLqFLg7tCsOGRYRtDLvF1mdz2Y3skXCP8KXhZyLIEXERNRGPIq0jJZGdUXBUeNSmqPszzWaKZrZHg2h29KboBzEWMXkxv8zCzYqZVTvrcaxT7JLYnjhq3Py4fXHv4gPj18ffS7BMkCV0J6olzklsTHyfFJRUkSRPdkhemnwpRTdFmNKRik9NTN2dOjo7ePbm2UNz3OaUzrk512LuorkX5unOy5l3fL7afM78w2nYtKS0fWmfOdGcBs5oOjt9W/oIl8Xdwn3OC+BV8ob5vvwK/pMM34yKjKeZvpmbMocF/oIqwQshS1gjfJUVllWX9T47OntPtiInKacll5CblntUpCnKFp1ZYLBg0YJ+sY24VCzP887bnDciiZDslkLSudKOfBraDPXKLGXfyQYK/ApqCz4sTFx4eJHGItGi3kLrwjWFT4pCin5ajFnMXdy9xGjJiiUDS5lL65dBy9KXdS83WV6yfKg4tHjvCtKK7BW/rnRcWbHy7aqkVZ0l+iXFJYPfhX7XVKpaKim9tdpndd33mO+F3/etcVmzdc3XMl7ZxXLH8qryz2u5ay/+4PRD9Q+KdRnr+ta7r9+xAbdBtOHmRv+Neys0KooqBjdFbWqrZFSWVb7dPH/zhSrXqrotpC2yLfLqyOqOraZbN2z9XCOouVEbWNuyTW/bmm3vt/O2X90RsKO5Tr+uvO7Tj8Ifb9eH1rc1mDdU7cTtLNj5eFfirp6fPH9q3K27u3z3lz2iPfK9sXvPNHo0Nu7T27e+CW6SNQ3vn7P/yoGgAx3Nds31LfSW8oPgoOzgs5/Tfr55KOJQ92HPw81HzI5sa6W2lrVBbYVtI+2CdnlHSkf/0fCj3Z0+na2/2P+y55jRsdrjWsfXnyCdKDmhOFl0crRL3PXiVOapwe753fdOJ5++fmbWmb6zEWfPnws5d7qH2XPyvO/5Yxe8Lxy96Hmx/ZL7pbZet97WX91+be1z72u77HG544rXlc7+Gf0nrvpfPXUt6Nq56+zrl27MvNF/M+Hm7Vtzbslv824/vZNz59Xdgrtj94rvY++XPVB/UPVQ72HDb1a/tcjd5ccHggZ6H8U9ujfIHXz+u/T3z0MljymPq54YPml86vz02HDI8JVns58NPRc/H3tR+ofGH9teWr488mfAn70jySNDrySvFK/XvtF5s+et69vu0ZjRh+9y3429L/ug82HvR8+PPZ+SPj0ZW/gZ/7n6i9WXzq8RX+8rchUKMUfC+dYKIOiAMzIAeL0HAEoKAFS0hyDNnuihvwma6Pu/EfhPPNFnf5M7AM3oNN4KsboAOIgO82I0NjqPt0HxAQB2cVGOf0qa4eI8EYuMdpPYDwrFG30A8J0AfJEoFGPbFYovaN+O3AGgK2+idx8XDv1H04yn8HPS+jsdisG/6B/MDRKPSjsq8AAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAcaADAAQAAAABAAAAWAAAAACLXdwNAAAjrElEQVR4AeVdCXxVxbmfOefe7BD2neQmQRaRgGiL4lJAxAQSFre+qn2ttbVqXxdRaNXWom3tq4D26bP2ta/tq1qxqGggBBDZqqigqCxBsWQFoSyikO3e3HvOvP8358y5526BLECi8/vdMzPf980333zf7GfmXM6+wO6ll17qwZOSRugmzxeCncs4GwF1DMCvN3498PPgB8cZAwG8AH7HET7MuHaQmeJDztluTRM70tLSPpw8ebLfoj+zT0j3xXIvr1w5QTe1ApR6mmAiH34GaUDaSGpDqQRGi4DLaIIHpRFHmeDvwF+nafrqoqKrdiUg7nCwkrjDGXcmhiUrV16omfwmmGU25MqOL5s0RHyUhLrx7nBsElkhNLZbCP48M/kzs2YV7I2l6jjI59aIS5cu1VNS0m8QjN+BLu8iS2Vu5auw5Ue2RKsVIk2AM44uEm0WnSkoiUwHPBU/8uM4xdcipkRwq8Dg8Zkzp6+Kk6DdICuLdrPpPAzIeKmp6d8RnP8YivNFShZWMMHDhmO1sNF2wcztGOvKuSmqDQ87IvxJn6WkNNfDOVZlrG9Samp9pml6MG6ag7jOR4LTeUxo58M/F3xS4LuyjcjzXWT60MyZM150EbQ7+LkyYknpqus4lATjDLNbgFSQy1iIyyI3Qc+bhCaW68zcOGPGDExQuFvzbVLssmWv9taTA19C111gMlaInIbHZcTZZo1p9xQVFbwWF99K4OfCiCtXrhxumPxxlH1aTPnJNOFSvi44+4vRnFRy9dVTP4mh7WDAy6WlEzVT+wYqyFfRIWfGsOfi/zQm5hYVFX0ag2sFIFy8ViTqTKTLS8t+hFb1G8iUZFkLVos0HIn7rMbNR6CsbWdD9qVL12ampoa+AcF+ANHywj0DqV8cwrh7e3Fx4Uttla3LGnH16tW9AkHjKc60GZFjkEsVXCzhwvNgcfFVH7qgZy24YMECbfz4Cd9hXNwPIQZZgkhDUmfxZHHx9DvaIlyXNOLy5au+hG5xGWdiSLxCo1BbDG7OnV1U9EY8/NmGrVmzJr252bgfrXJ+pCxiK2fm1cXFxR9HwluOdTkjrlhRdi0K/xyKJaf44a4J7VEwA13TvJkzCx9tudidA1tSsiofuz1/QHkmuCQ6gt6lqLi4YKsL1mKwSxlxxYqVt2Hd92R0iagQsOhOnZs3XFVUdMZ2SqLlaGt8xYpVD2Hic48rfTPKhAY5/RUXLGFQS4jpZIiSFWXzwwZEe4N89MvQTdbNYzy9ddvWcV3RgKRmTGruRTdCu0kNFIdLQllXl5auusqKtvwkPbTZDR8yZHBI00Zypg/m3PQyUzsimFbZZDRVHjhwoLHNjKMSYgy8Q+PiCQ+Wch5UOx3TT/phLebf3ZT6wzuumfqHqCRdMlpaWjrKZFoZiuazZ9rC5Nq02UUFr7ZUoFYbcdiwYX3N5tDtWEzfAsZZ0cyJIfp4cm8i8JxHGC/s2bfvgAVq/XPrmhVfbTT4c36Ts09COjvU7GWHQx52HOGaJn1f2fGMp2FWrMGCfqZx2oTeg12XPaz+8EdsweRQ63M8uymWLVvTz+s1XoUOx5Ak0GeQMe0ijJHvJpKsNUbUhvl8P8fkgabHcOJV7CY+IzTtTa/Xe7ChoQGNUktJ4jxHCO0STKOvAdFXiBKzyFJ4D+2tqXmT4qfqfvbs+q/08pob36hLY7saklkFDNiMqQsMZf1Iet3Ag6qNuyiIC/YvGHULAssY95SyuaOPnWq+Z5uurKyse9Bgm1CicbYsnwS92phrCgoOxpPNXfJ4eAnLyckZoZliOSLDoaunvIz9/MPq6uqECWzEyMGDexuepG+ZTNwHEFoLtrpMbV7lvsq3E6Z9ojyDBVABTPPGJCaubDYxZUErZBydJ4LSYM6UFHABuNpjI98kg9IPTsGtsebvTGO/ZXPzd1rIzv1E19rTFBpebbFcFISE3TazuPDCeFJLbDyEguVlZ08Gk/WIB7nGi/ZWVZ3SjEmlt319WHb2DzFYL7bi4o8G5/NRDz5z6B7emcc08T3k9e8wTG/LANSiICJJSYYjp2FQVGGKK4NKA8KghDddhiUacgrPtb+A/0/YvLGHLUTnfWI7MRvbie9Dwh4kJTTw+1nF02+PlrhFI8KAU6DEdVDiQQ8Tl+ypqamKZtCaeHZ29kBP0P87rnlmC9M4rBvBG/ffvmR3Y8+cB1lz4zehaNnWHJ7KQG6fkNGGlAmkpSMNrFqijZJqoLrA+Sco13fYvDFt3uqSWZ6BR2np6stMYf7DrslUn+dg6fGyO+uERsyxutDdKHgj83jOraio2OdO2J5w7jkjb9AbTzxVP26WfnDSbUHw97IQ5iCkdLvBOa1PSojWRQinNUWJrYwcD0/8NOKr0hPADnO+gN015oH2lOVMpMX6eC71YrIIjB0zjEDenDlznF4sShuWSKNHj07y1zfsAdKHAk9s7YTkZAXz/HLz5Xqw6flAn9x+rLkJWdDkBE4pOiJMIpLibRemoUTNQNXD4ClImwwjYxMcTtEon2ARBgY/YmlVmkfYvPy7iKQzu+UrysogXyHJCNH/hm71JiVvXCMOy/b9CYTfQhkf2FtdvUARt9tfUJ7EMvUnoPRvYxkgVwUOT1I4OdlVYkyTs1DQUCPUzE9hmC3AvYXx7l2m6bXAH2I8VMe6B5tZQ7OHBTJSmDc0kHFvLgbFiXhJewVSftmpAPS6kMZXy3rwECcj0o/x/2B3nfcEAp3WYcbaN2SwKsiaTmXAdsdl2CR4nQSOMSImIBeDhDaOaypqqn1E1CHu0Z2jmCGeh/JGWy3ANppUop0DKVbAavj1Sw6yKZmNbGpm/e4/7u9+8ZYfXHSi1XJQnqb5LRjvNqTFgSgqrp2vMqKqPAbezv9kXHmr8ziDCZaXrroV+vsfO8v3ZhZPH0/hGCPmZfvondt47OVdU1lTs8xO0D7vke0FzGAvwHjpVguAoShnNYskRdIyQuhsWFqAze5dxy7p1sD6eA06Mzj54sLije0SYOH2fmjRD2GL5xaLj8uY4Ur0Jrs7f2K78jkDibH9+B6kH0dZ4QjK9bOKCp+nzspxudnZMxAZD6KKDjPgove/DgOtkgZUCqO1nbslCA/rid3CO4d8wh7LPciKe9axNK/G/N70le02IJWOlhN3jf02as5sTHKwP6l6AeDInpa7mC3eWaQindXXGL9TyYYR4kEKRxgR/ey9BIR+HyO/3W7xzttRXZ5ya0qOecqYpEBDZ5My6+v/lPcxm93rOACc1cOozSGT/fOjqo6dcMzLL4ERv4Q8jlhdOrKz7WmVVTxg+Z33iXFwI+y0wdKpGLl8+epZjhFzh+TSXt1E6FXooaRn212MhTtugIJ+Z/GxNSW7TVcrDGr1F2Y03fLjwUf3d9MFOwGDhkCamp7B3nxjM/vpPXPHtluOaAZ3jvkAuzqXoaZ+KisUWVFWKvimGM8W7rg4Oklni5uc/8Kpfdz8iWNE7jHR3VA52NqPDnx0tF2CL9w5Cen/JjNytzrVhRIsxCpSdCP/7qyjO5M0NpI2uMnU2H9lAX8T27h+HUv2Jv3F5/MNaJcs8RL/eOwe9BBzZJdO/SnJFe5X23REIl42pws2q6hgA6SW24fw+zpGhAavBwC9jdwjbXv+i3cORVVY7uiEFKSURBmQ43wzY97z/fPGVvXXQz/HWwppQFJkckoq271rF6uurGQpqalpmhCPW4k6+Dk/fxMy/YXVCm3eVLk4m8kWVOHsaGd3wu7l2CppRFpWQOQBVB+F6dnULvFN82WsAbs5PKRioBxlSMbWsrqjk9iPR9ZtWLGiT72pF1C+lsP7Ql1jBz7e/35zMAj9ovdn/Fps/52eWeO8/PshV4UlGyQgGTnvzjKOf0VJ1Fl9r1dfasu2ThoRL3LlrAyqPlaxr+KDNgu+aMdvoITx8s0CMVGtUBoQcc5eY/VjCtR7viZdnwm16YRwuRDTkm7kmrYvDNUeduE7Nsj5fU5rpApHyx4hL9x0bD4dzK2goOCYxvkSIfTt0og4NT2V8sCGBi127T2wVub6m530mmS+TEW7LuRIKRS2rPEhBtxCtoDeKVnOMNgcK0RtEW2OWh7Xdixe/OvdmD5vpPRWUnHJOT6f+zCRzaEDvLvG/B1575ecaBeJZOacllqd3qWnp8z3+4/Xenw+Xw80FDkL5IJ/1GbJNeN/5YpFtT7JiBRCAd6E9jaD3TkWazTL4c4EVobsUhVHFUIQ57w4Wy1hGnsFoK8TlHhgwvVDhG6QuI5+dO99L6ru1/AiGxUYVZlrn3Z0FqeDH+5Dysrn8TA2FopKtjIxK9uU2cKdt0ABY52xhWozOWkB+JzfzO4cE8E7JSWDtozwnoxoLUKyv2nixAA5Xd9hVQAZI4qZ+f37p+84dMipCBYm7pO6ApV7NAHHBr+nvLy82UHcOuhphOkXz9mFiUAl4h1BFBVpSaYo0pNGSSYMQ3R0Azdh0bmNk/vCiGAb5wABW+Ue+2cya/b/KsaA0pAoqxAvYDsLXVa045hMkS7C+kCSgBDB94gSRz4+Bi4EI6OeSVOnN6SmXolgxLs0wrldns9XgmY7ERXH6bZdeJJKC9Q31AKGRb81dAwf1K0PM5LeMYWgWSkEMrBYTtFYEtVt0n2Mw66kqEMeAUiGV0LiMLr/PSYXr/fs0+eVbdu2SeWqVJDpt+B6E+IkU7jAiISrsE1N2HjVxkbbWBKqFnvbsgwecB0nDWC1HgjUStfsvxUp+su3ElI8PORERkriR/h7cTlquDMYURxJ9RG6CClDKBTyM4+XWos0ImFxaXMqvIRGzMrK6gmexVBuQjXYWW4CH2fsN5J6X4p02ZTHqTpk0d/iRW8UIBseNIJ/dvSTWmxfzsW25YsOL5NdDVRvJ46ATEPp3EAKE+LU3D9AJsuArTgxDIW2kglB+16tdOJOSxSIg+oYrhAUZgsTHoMQdJcvxpUriGnSjrhVJBXAavJ8hY/nJwn9MpUmHt7RD2dqeq7I5Hs6B6+gUb4b71Y+hSXOAmbBmC+g9RVQ8nOys0cBOTSKlWM8SufmS3TR8ei0FEdX4FQSapbOjghqV1K8BAlhi3dNBi5HVgJVKlUhGF7WJjcuipcWk5pUiJoVjdM9urO8SdfT+wAPOqeKUOEGR6dxxwXH7Nd28RRhK5tmL5sUHfnoOKibdhRLYcepcgHgCsYoWuLcmQo2j3gAPscNdvjaAUrn5ktgFZfpVMSmJ4/g3OOhligduipuNXM5q9QyFeKUfCGulS2P0tL0nLKnHOjEmWB/YgneAeJLEwNB0j06DzTkSgemGWPt420OCFyTL7jgAm/0mOMQaOwKqQHIg/HdAbsD6Pzera6u+peC5eAYCm4G56i48ik18rPKYwFXoyd4BsFsdOu4ToDWFT8Li5qGGDjQvQdR5mI09CLcA2oajHIWA9VT8lfUcXyJ56wW2ayD3DRfOY67sCGcKG5wH5fxgCDVIqatLzOm2cfh7QKJSTJCCpNdKWLETMZDf5C4OA/MVgbgcmUMRtc9zrlKnKy7JoYAd+gTGRAb+Odgk+EcmSaBAQmHqmYtYWzmmmm1QjvqeNHS4Szt4oraSjlzxvnbctSThGMz2RZzjXpiVlFTswoe/RxHr/zQ5ZYqANFH50c4WGSX3zC+vH///iZFG8/XkBjHQm2U4OfFI4oLe6S8F4x1jtW2IYbDAwEhdrG7x++Omw5AXIfu68bJhgzFp6SkyvVZVmZmT03XrnfT2OHqODAL5DGvSIhzIUxhRCgUwk4nNCkyrqNyCZzl8bC3FR6z2AwVjufLJJxtj4cjmCa0dDdOqY5gUg5SCBwqwq9PZkCioz4wXAIeccVKohI+QiEfCue1ZqVuMSiFWJkwHRCwV69wpjJuvb0I0KkppE5JuR+evXYliOXQ2N9U4WgfGxVy61DB3UZxhT/p0bfvVkXj8/loSTGR4qoELlqLjAAa21JZWelM+nDffo6FjHrayicoPnDktLQoKuRlj90uekUj5bB7ErxyWq/gLfmWEcMUo3JycrLD0RZCOseECFlSrlZTchHrr7kiMUHBNa+QBSANWWrDupB9+umh6qwBWed6k5J/FJMIABykfSkeHPdDYHBxqRtHYimDUJgcKsHr7u4YE4IJADvzAKJXtETvOBPfo7Hd8EHD+8AIERVG4eQwYkVq9tZWlTnw6IAQU6RstrEUmmAumd/H4Wpn7FY08XwYUUTcUdAM8dV4hLEwvH4n565NKizYh7H0YQiUmWHJL2sABKeuNCXw2mtvjQwE6l90KcNJhMJ9ULW/ymlFDgIBLWB8GZ5lDJcVXEGLnMe0joilhaKXilQRpISsTblDcy8clpVzneltXgtQTC9hZSCfjRjLvoYQJsGxblhW1mjsLWYRe2UwReXKkrYf1yj4yXwYQjsESwwhQmKK1dlt8B6m+EkdWYLOy5BTh55w3YzpLe89YimAQ81SOVAQGTCZnThxQtvy5msrk5KSBhKMZHEXCnL9QuYT5xHC0oLoZRp6qLAVtOBghkuo62yQ9FDnplFAKdTty0Q2MVreHzlmD255bBSRGYAfRrwaEqzHqfYnP9q/H7tNCZymTXPPAaOpVB7oqV6JxiWKw+Bij0LahcjB+8VbFCyxzzHJhCNDKp9aohAY147Lsc1CxHvyRkpGxkpPT2d1dXXskYd/491XUzPQm2xVclUYyV2wtyurq5fE42RlzR1jKBqVnuIyzNkH7msIdKUAKGfzQNErX/FJ5NtyEe8TmP6XQY//UVFT9dMWDQhmqOuu96eJuLO6pmDwrYTYKARenLMtUTBE+WK60RQLd0GEdsR694ZiWBZBo0bvrPFkeZDXRRodxKsvv67rrHv37qyysoI99OADrHznDpaamioNa1cLqwWh3B6dfz2ah4r75PENnI2J4xQfieJ4Ge1yOueTXNFWBYmvNLaVQU+U5xYYcltulm9TTk5O/0TMhgwZkoqTE3Ii5dDEqzWCvdGaS7oe6P0ftDZ3O0Qzgx7vUsCucMMjwsKogdHQx9jb55IHHkKkYTreA7RyuRCRxo507565vzkUZGWlK9jzzy1hTU1NLD0jQxqQtONsyIMeGfz7nqpqp7eI5qczNgmwCHspGimSHUGrj5gxa4LPiN9BqtTSNzDrvQF76QY2D8agws9DRmluvpLKzh11+XLdFL8F7GsRXOxIkqZNhLEjlydKcjCnnol44+x0xFo2Hi83zPPP6ur3c7N9VeCV40YgPCUvy7e0orY63nrNOsu5cEcl1Jcn01FXqgTSNVp0V0Xxc6K/e/yxfvUNdeztLVtoQuO0QEmgeMiI+Ck2kv/mJIwfcLbarCSkBjBx8QGkIb2xcbM7OQw4ieJERinkw07jwBgrxyyTKjO5F7HIn4hiXmlFXWkBUGnAa5zCR/sw0lXRMCduG5Dimmme8ngo6eWDx3+XBr7X4V7GuhFDhw4iuhjn8W62Co8i2AqQ60bNc1EMLQB5WVkX+IYOffYfmzY8+/62bSwDrY+WFjhmIMkVC4qgTt6H3Y5fSURLDxHVWxAvNyOkxcD/hvs9ZE5OTj7Ach9WGpD4u9I4MBY1uRB2hSV6uDBdRDhitm9Rqie/ypWNAkb7tXtra3dHA1uKy3UiZihPgsieZobJSUj8puAe95687Jy7R/ftG9kVpGYuYd5UUKFTo9d+XuyfezExSe9Ne4PSDR80qE+uz3czjRcw8Du6pn8Ne6ccuzNW9wkqmQ+quD8QYPiiYdDf2PBN3MR6yGaR0HMbwyFya9YGYiYcsfDGVltMi4hRrsVnleI7bOjQPIByVZzo1c9tTXSKbyoat08fqUA8P454bjLiGTGDjkAmiEgjWotKsTgejVU46sfFwkBaeg3dmModMuSanIE9sgev+dXbLNRwSF7FNnG+qbGOJR+rZRm7Xx2fM/aiRecMGPCq4U3ajyn1n9FALo/gbzHGECpwNTHE6jFDzcr2sSuumHbVx0eO/DWCNkEEE4rpxMZmZVFFRCwQJhMRkxqUpSCapVu5kgXHWWYuLxZJUqHL11xOMqJXv0gBzLiL/JCuT3IStxQQuPLQgqNekc4bYQVx/iQ2Sa7VnSLTrocIhmiR7muBh5RXFhjVmwcaDhm9Bnc3vSmpeBPAeHMjTtPgumAQe7+6F69zqZWG1UOZhWM03TZZY2MjS8ayYuq0Qjbn2mtZtx49L5906YTXWpLBxnFc/vkA4RHRfFVagqN7qaqsqXZa0IgRI7qF/IFDQJFw0kWnt+PL8Obc2YTHvOEtwCeoNOTHphP12LDuF2+/E5X/byj7De700WHwMw2ND6qqqiL5Yhw2G67FpC8H62w0DOHHQJGHdekSa9cF5Hv37g3AwnNgi22IyhYawwUAxwh4pyJSMvprJ44yXS34MdXFlho+pYP9XfLD1DKoZp3EN4hzpfS74IIL2cyrr2HDR4xigUATq//s2Eyg3UaEsXDdztSDukek4sBGD8zeslDeb4BuBPFyZELYrViCY2x9lWiUCwUClyDsGJDgTnorgRXnbD9qO26HsWwc37oRE6EIA0akQ0Tmi73OeAa0aSeRT07JqHwLSnKId6uqquMakFoftRsQ+dGzXY5JEsYu8wlD1//NMSIxopnqsJycQuynUJeAge5kDmJ48I2Lk5HZyiEyEry5uZl179Fj6y23fvdLY8aOQ6UyWUNDPbpWtBvOpoNEvlAlep/PhwNYbDPHQEabQuHqRZxiXbQsiJdEUcV0pQ4eLImr5CEYPmvJf0C4U1iKyDT4MsjjDi9XICcnZyzesTqTQyWj8p08WeKtNgw75w2p9f11v6/6l1jVlaM1XskN8zgOlO2PaXH0dQxT4xMhQ6VLDicYX3UWOhIHEUnrIfwLQTO6V6MZ2jCPwlD/0xzwn7frg90TLrrkkoMBv581NeJDwKo1468N1q7dNEplqAthTentEkfmYSld0iqN2AklnWD7UjMyIsdDe6tN8e9Av6zSft8YzVM3wmMwyaV+ik6JbpraGgWL9qFJsZFtDMGYOKAlbkVrPLp3374KxEMxRqTE6JO34nrEaMw5fo209bZCJF+VYbQghBRkNDkuHme88QQM6GdG5mAWyp2wVqT2KmoKhbIramtv+9exY+VEf/yz46/TuKgc8pPOZCFnbRoyjEIJlEIgD0Vs+06c8E5EBmuFGZrhPpo4Ijs7B1SjbFYRnBTMxSICnzBiJdjoSUn+t0Q0GEasMoCAyBPkcVxP1rcm5CG0feglp2En4AQax+3oHYzc3NwsLM/OUbInSsvoM2AYvK7DUf+r0SGfDwHwLjCOI2Po+qfB3r6eRq+hrLn/SNY0YASrHzCMsZTMbazf1gns+usNd8rlK1dfD4H+bsFIFKt4Xo+3srDwyjyahDTV1Z+gtaRyYaroVBQXIWyd70UBn01pbHy0/MgRdAFhlzuw/4/w+ZVHre3B8Gjh8KTsVYR8V1SKFgmjHant2NH5MzYEnpbEcR55eXn9WMg4FAcVAcLsfS2+jyD3gCMQrgg2G26HmrtrzCzFl7ywg8Qv5R7t97ZYLsoWgjSDNf1mFsal/pou0tCUMZMRzZh0nPA2N3wSGDXqYPV1T90LRfxMFpq60BB1o9AOx+up9PQp7Lu+gyqLkpKSbprmPYzJVAoK4Ti63oYP00164Gf3vLG/svK6tG7d8CU3XGBUjvQfrg7c5GYDM/VDHtF8sKUN6OHDh+cagcAIYTSnaSH0QkmRy17FPo5P0jUJbtLAfQKD+Gd+IQ4kmsS402O/tFeSrhfibX4Q8HAZXESmJjzYpdl+Kot8THDG4YzNcMhSFzCMLZDhmEt1Lq7tDS7e/SAaxc8cNmQh2VfizoOG+xdzx7yjcKtKy57HxdJraf/WbUhca1s7berkFmum4nFSf9HubJacdqHecBT9u8GM+yZE7KOeNH0nJ4g7JrZb5rvOvR8tD+8llfEUR7y3NMVbbNH2OxSkmyf4Ow/IsDUW4TDhuXLNhg3nRQDbElm88yY023IWOPGCkZxWamR0n8IW2C+028KvE6aJUl0HS7jofZys5s+giWVLzrJbtbMUYj0Ler7P7h29e+Oq0m2NIX18KKq3AWUpPoHlbOG1SrpHd+Siy12MHmC208Q5u5ndlf9/reLTBYhPrxFJAfTVRL/xCFrld6wuFTC3MYPaf88bekzM6PXZ9+vwtzCRgwbHpVNx6fTp0zefsi4t49EZne+BGXoa2U/vQmW6Ed9y23HKfLoQ4ek3olLGw7suwfbBr7EOuUyC5BiJkNzZMdlfhx1kA/HdGrq773a6JrbjH2QSvt6RtIve6cOEdypaHLpOXKGTVYH4cNyMEQ+x7A8fiJ4Zu/Po6uFIjZ2J0jxSXsDM0HwYb7I8KU6DYVBj1/T9jP1g4DH5BY1wa+QsTTPY2/UZ999T2XcJDslwnKNOR/resFMORtLzsESZgKH3fBgw2SU+LT6fRqV5kN2ZX+mCfy6DZ96ISo0Ld+ajpXwDb0Cuhu+jOdCfcg+woUkhtEaab1mm9AJej+XE3OqBbF8Au4R0Y42OgdC6lCoAbcjK7Tr4tMtksmeYFvozDi/XEOCL4GTJz2pB6XjHoh1fZoZn8qQejdN+OvTQZDIiNSXqcclO6brJttensDurB8B4AHhgVYnUDsOA2P3hr2ErahW+GnXKh4vOapk7OPOzb8SoAq1dWbo2YGpTyYjKkZD01wnrPs14d8mxnvMq/Lg+bugfM//hA+ojDor2i+hHvMXoDArAhclvw4B7IYtHTWKpY603NDalZ8PYy3o0pF01Y8b6ziBrZ5Hh9Cz221G6K2bMqMEk5XvEIryDQ6/RyJBcD5p8xfqy5V9pRxafu6SdrjtVGsYnIfGHXvSJFBKRTBjh/LinPnH6rOnvRUC/oJFO1xKVHTRm3ATzVah4lJ+C3hUfpFo9Pgr+hYx2WiPi364a8W6rCK2wKZ5l0DYz8crpdfxZ1qR4+K4I27BhQ0pJyWq8u2ud67RGpGLQn1fi/SD2TjEmxvSoRIEzN0xsWL585dcp1pUd/ZlJXb1/PU6bD25tOTrtmOguCIx0PWY59stjwkSOk3IWq/FFM4sK57nTdZUwhgV8EApfpmSsX3FRYRoOQcWtsonK06lbohIaf2m+FHchXK0tsoyyzELcja51c1u6I5XP2fCt/4Q030VFzEKplrbWgCRzlzAiCYoPlj+D9pfgHAu1TFqGiIm4R7irZMXKH1KazuyWL1+TAwOW4kTdk5DTuskQewn2lIrQJbpTd0lKSlZeiS9rLANMnq1wNgRQjcPrStnhbsEXG+d11H/Zu2VoTxj/b5EcNNl8dJj3gQ827Z2hAQf+ggNnzZp10vM40fl3OSNSAfBfvCO4jr/Uw/FGZwmZoCSw7Uv4UMIvW/r/wWilnI44fVUyJaXbt7HH+xPwHxqbh9g+s/gkr9xiE0lIgqInoO5EYPoqVXJqxh9RgBtbFouKKMfQVzDT/S98zT7uXYmWebQdW1LyyiDOQzdjm/82SDIkEScMBrcXF8/4fSJ8S/Aua0RVKIwrN2Nc+S/EuylYPF91uygwDtyyv6OrffF0tU76E8tQCIee8ZIa+eEyKz4VE+FI7bJiwecfY9L2XXycvc2Ht7q8EUk3UNoQ/I8S3dB1LsAQPOzcSgtDEaqEEtejlazDN0Pfxb+xVlwfdTY2gjpBZOnatZkpTcFRQF+KIW6K9O1KpSpP3KSC/QEfnJ2H4ycn4uJPEfi5MKIqK5YYuMch/hN1fIyCWX5CI0aS4SsY6HLp8HE1/Bog/4UXmHU4A3ucm7jyrWm4/cVwW0j0AW4wDObDLw+NKgfx1GhmCeMCV+w1857ZRUVvJKRpBYJK97lz+Dfwb2ICMR8Fo9YR5VSRVXdmoymqUFEp2h8lxuj0mfzIxX/iBN/L7ecZ5nDaxA5ncfZCK1aUXYvu7PsYmy4Pj0EtyeNWR5SRkSy2a7SM0xJHSobfKiwEHysqKkx4YeYkPFpEu6VukbArI7EkycfXDDDJwB9+4Tuy0WWJNU40RRvinO2G9Z7DSZNn50yfnuhtTBsYxyb5QhjRXWx6fWUIsxBbVdOwOUAfsc904yPD7pbmDoepqAKQA6+jOLSF6wlinaaZq4uKinZZmNP//MIZ0a1SutCD/zMeAeXn4zcakxhcHecDQdMbiukB+0QtDRguW/LjOJx1GEcuD+JizR7QluNzPjvwMYkP8f1yv5v/mQr/P38PeKjJvbs2AAAAAElFTkSuQmCC"
            ></image>
            <use fill="#F3F4F6" fillRule="evenodd" href="#rect-3"></use>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const VisionIcon = (color?: string): ReactElement => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      x="0px"
      y="0px"
      viewBox="0 0 16 16"
    >
      <g id="icon-_x2F_-vision">
        <g id="VisionRectangle">
          <g id="VisionMask">
            <g>
              <path
                id="VisionPath"
                fill={color ? color : '#000000'}
                d="M0.5,2.8c0.3,0,0.5-0.2,0.5-0.5V0.9h1.4c0.3,0,0.5-0.2,0.5-0.5S2.6,0,2.4,0H0.5
					C0.2,0,0,0.2,0,0.5v1.9C0,2.6,0.2,2.8,0.5,2.8z"
              />
              <path
                id="VisionPath_00000164481327005804995840000017770029646598013063_"
                fill={color ? color : '#000000'}
                d="M0.5,16h1.9
					c0.3,0,0.5-0.2,0.5-0.5s-0.2-0.5-0.5-0.5H0.9v-1.4c0-0.3-0.2-0.5-0.5-0.5S0,13.4,0,13.6v1.9C0,15.8,0.2,16,0.5,16z"
              />
              <path
                id="VisionPath_00000087373799370150199610000009280667040530594971_"
                fill={color ? color : '#000000'}
                d="M15.5,2.8c0.3,0,0.5-0.2,0.5-0.5
					V0.5C16,0.2,15.8,0,15.5,0h-1.9c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1.4v1.4C15.1,2.6,15.3,2.8,15.5,2.8z"
              />
              <path
                id="VisionPath_00000118364782446214358650000009406471652432606381_"
                fill={color ? color : '#000000'}
                d="M15.5,13.2
					c-0.3,0-0.5,0.2-0.5,0.5v1.4h-1.4c-0.3,0-0.5,0.2-0.5,0.5s0.2,0.5,0.5,0.5h1.9c0.3,0,0.5-0.2,0.5-0.5v-1.9
					C16,13.4,15.8,13.2,15.5,13.2z"
              />
              <path
                id="VisionShape"
                fill={color ? color : '#000000'}
                d="M8,11.3c1.8,0,3.3-1.5,3.3-3.3S9.8,4.7,8,4.7S4.7,6.2,4.7,8S6.2,11.3,8,11.3z M8,5.7
					c1.3,0,2.3,1.1,2.3,2.3S9.3,10.3,8,10.3S5.7,9.3,5.7,8S6.7,5.7,8,5.7z"
              />
              <path
                id="VisionShape_00000155850197231202405310000010378144532667071120_"
                fill={color ? color : '#000000'}
                d="M8,9.4c0.8,0,1.4-0.6,1.4-1.4
					S8.8,6.6,8,6.6S6.6,7.2,6.6,8S7.2,9.4,8,9.4z M8,7.5c0.3,0,0.5,0.2,0.5,0.5S8.3,8.5,8,8.5C7.7,8.5,7.5,8.3,7.5,8S7.7,7.5,8,7.5z
					"
              />
              <path
                id="VisionShape_00000001633993868544480900000017573144339816328606_"
                fill={color ? color : '#000000'}
                d="M2.4,10.7
					C4,12.1,5.9,13.2,8,13.2c2.1,0,4-1.1,5.6-2.5c1.4-1.2,2.3-2.4,2.3-2.4c0.1-0.2,0.1-0.4,0-0.5c0,0-0.9-1.2-2.3-2.4
					C12,3.9,10.1,2.8,8,2.8c-2.1,0-4,1.1-5.6,2.5C1,6.5,0.1,7.7,0.1,7.7C0,7.9,0,8.1,0.1,8.3C0.1,8.3,1,9.5,2.4,10.7L2.4,10.7z
					 M8,3.8c2,0,3.8,1.2,5,2.2c0.9,0.8,1.6,1.6,1.9,2c-0.3,0.4-1,1.2-1.9,2c-1.3,1.1-3.1,2.2-5,2.2c-2,0-3.8-1.2-5-2.2
					C2.1,9.2,1.4,8.4,1.1,8c0.3-0.4,1-1.2,1.9-2C4.3,4.9,6.1,3.8,8,3.8L8,3.8z"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const ShoppingCartIcon = (): ReactElement => {
  return (
    <svg width="58" height="76" viewBox="0 0 58 76" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18.8125" cy="68.5625" r="3.5625" fill="#2F446C" />
      <circle cx="43.75" cy="68.5625" r="3.5625" fill="#2F446C" />
      <path
        d="M9.87169 23.6819C9.70518 22.8493 8.97411 22.25 8.125 22.25H2.78125C1.79749 22.25 1 23.0475 1 24.0312V24.0312C1 25.015 1.79749 25.8125 2.78125 25.8125H6.66438L13.5033 60.0056C13.6698 60.8382 14.4009 61.4375 15.25 61.4375H45.5313C46.515 61.4375 47.3125 60.64 47.3125 59.6562V59.6562C47.3125 58.6725 46.515 57.875 45.5313 57.875H16.7106L15.2856 50.75H47.3125C48.1473 50.75 48.8702 50.1702 49.0514 49.3553L52.6109 33.3223C52.8577 32.2106 52.0117 31.1562 50.873 31.1562V31.1562C50.0386 31.1562 49.3161 31.7359 49.1352 32.5505L45.8843 47.1875H14.5731L9.87169 23.6819Z"
        fill="#2F446C"
        stroke="#2F446C"
        strokeWidth="2"
      />
      <g clipPath="url(#clip0_0_1)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.5674 25.0283C25.0377 24.8511 25.5623 25.0887 25.7395 25.559L25.7398 25.5597C25.8856 25.9469 26.2766 26.1796 26.6921 26.1863C26.7576 26.1875 26.8232 26.1899 26.8886 26.1935C27.304 26.214 27.709 26.0078 27.8805 25.6291C27.98 25.4095 28.1628 25.2383 28.3885 25.1533C28.6142 25.0683 28.8644 25.0764 29.0842 25.1758L30.0393 25.6082C30.259 25.7078 30.4301 25.8905 30.5151 26.1163C30.6001 26.342 30.5921 26.5922 30.4926 26.812C30.3218 27.1904 30.4343 27.6315 30.7228 27.9297C30.7685 27.9766 30.8133 28.0243 30.8572 28.0729C31.1364 28.3807 31.5692 28.5211 31.957 28.375C32.4274 28.1978 32.952 28.4354 33.1292 28.9058L33.4984 29.886C33.6756 30.3564 33.438 30.881 32.9676 31.0582C32.5798 31.2043 32.3471 31.5953 32.3411 32.0105C32.3397 32.0762 32.3377 32.142 32.3339 32.2071C32.3133 32.6224 32.5195 33.0274 32.8982 33.1989C33.1179 33.2985 33.289 33.4812 33.3741 33.7069C33.4591 33.9326 33.451 34.1829 33.3516 34.4026L32.9191 35.3577C32.8698 35.4666 32.7996 35.5647 32.7124 35.6464C32.6252 35.7282 32.5227 35.7919 32.4109 35.834C32.299 35.8762 32.18 35.8958 32.0605 35.8919C31.9411 35.888 31.8236 35.8607 31.7147 35.8113C31.3369 35.6403 30.8956 35.7521 30.5979 36.0419C30.5513 36.0871 30.5032 36.132 30.4545 36.1757C30.1466 36.4548 30.0063 36.8877 30.1524 37.2755C30.3295 37.7458 30.0919 38.2705 29.6216 38.4476L28.6406 38.8171C28.1703 38.9942 27.6456 38.7567 27.4685 38.2863C27.3224 37.8985 26.9314 37.6658 26.5161 37.6597C26.4505 37.6584 26.3846 37.6564 26.3196 37.6526C25.9043 37.632 25.4992 37.8382 25.3278 38.2169C25.2282 38.4366 25.0455 38.6077 24.8197 38.6928C24.594 38.7778 24.3438 38.7697 24.124 38.6703L23.169 38.2378C22.9493 38.1382 22.7781 37.9555 22.6931 37.7298C22.6081 37.5041 22.6162 37.2538 22.7156 37.0341C22.8864 36.6556 22.7739 36.2145 22.4847 35.9166L22.475 35.9064C22.4336 35.8628 22.3914 35.8183 22.3503 35.7734C22.0719 35.4653 21.639 35.325 21.2512 35.471C20.7808 35.6482 20.2562 35.4106 20.079 34.9403L19.7096 33.9593C19.5324 33.489 19.77 32.9643 20.2403 32.7872C20.6282 32.6411 20.8609 32.2501 20.8669 31.8348C20.868 31.7694 20.8701 31.7039 20.8734 31.6385C20.8947 31.223 20.6885 30.8179 20.3098 30.6464C20.0901 30.5469 19.9189 30.3642 19.8339 30.1384C19.7489 29.9127 19.757 29.6625 19.8564 29.4427L20.2889 28.4876C20.3885 28.268 20.5712 28.0968 20.7969 28.0118C21.0226 27.9268 21.2728 27.9349 21.4926 28.0343C21.8711 28.2051 22.3121 28.0926 22.6103 27.8041C22.6569 27.759 22.7048 27.7133 22.7533 27.669C23.0613 27.3906 23.2017 26.9577 23.0556 26.5699C22.8785 26.0995 23.116 25.5749 23.5871 25.3975L24.5674 25.0283ZM29.2135 33.1057C29.5273 32.4128 29.5529 31.6236 29.2848 30.9118C29.0168 30.2 28.4769 29.6239 27.784 29.3101C27.0911 28.9963 26.3019 28.9707 25.5901 29.2388C24.8783 29.5069 24.3022 30.0468 23.9884 30.7397C23.6747 31.4325 23.649 32.2217 23.9171 32.9335C24.1852 33.6453 24.7251 34.2215 25.418 34.5352C26.1109 34.849 26.9 34.8746 27.6118 34.6065C28.3236 34.3384 28.8998 33.7986 29.2135 33.1057Z"
          fill="#0A70FF"
        />
      </g>
      <g clipPath="url(#clip1_0_1)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M47.3804 16.0191L41.8194 11.4543L35.2104 14.2977L34.2374 21.1766L39.7985 25.7414L46.4074 22.898L47.3804 16.0191ZM43.8512 19.0282C43.612 20.719 42.0559 21.897 40.3756 21.6593C38.6953 21.4216 37.527 19.8583 37.7662 18.1675C38.0053 16.4766 39.5614 15.2986 41.2417 15.5363C42.922 15.774 44.0903 17.3374 43.8512 19.0282Z"
          fill="#8AA6EE"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.0566 3.6273L21.7519 0.841946C19.0839 1.57542 17.2669 4.15662 17.5775 6.99539L28.9811 5.74774C28.6769 2.96675 26.4325 0.8686 23.7432 0.653442L24.0447 3.40978L22.0566 3.6273ZM25.0501 6.89912L26.1125 16.61C26.2148 17.5449 25.5399 18.3857 24.605 18.488C23.6701 18.5902 22.8293 17.9153 22.727 16.9804L21.6646 7.26951L25.0501 6.89912Z"
        fill="#B6CAF0"
      />
      <defs>
        <clipPath id="clip0_0_1">
          <rect
            width="17.2075"
            height="17.2075"
            fill="white"
            transform="translate(15.5195 26.9036) rotate(-20.6382)"
          />
        </clipPath>
        <clipPath id="clip1_0_1">
          <rect
            width="14.3396"
            height="16.4906"
            fill="white"
            transform="translate(34.8633 9.42969) rotate(8.05102)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const FilterIcon = (color?: string): ReactElement => {
  return (
    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.08333 18.5181H11.9167C12.6991 18.5181 13.3333 17.9308 13.3333 17.2064V12.2283L18.5821 7.36839C18.8481 7.12353 18.9984 6.79095 19 6.44362V4.08907C19 3.36462 18.3657 2.77734 17.5833 2.77734H3.41667C2.63426 2.77734 2 3.36462 2 4.08907V6.44362C2.00158 6.79095 2.15188 7.12353 2.41792 7.36839L7.66667 12.2283V17.2064C7.66667 17.9308 8.30093 18.5181 9.08333 18.5181ZM3.41406 6.44392V4.08937H17.5807V6.44392L11.914 11.6908V17.2066H9.08071V11.6908L3.41406 6.44392Z"
        fill={color ? color : '#303E47'}
      />
    </svg>
  );
};

export const SavePartIcon = (): ReactElement => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.25 0H2.5C1.5955 0 0.25 0.59925 0.25 2.25V12.75C0.25 14.4008 1.5955 15 2.5 15H13C13.4142 15 13.75 14.6642 13.75 14.25C13.75 13.8358 13.4142 13.5 13 13.5H2.509C2.1625 13.491 1.75 13.3545 1.75 12.75C1.75 12.6742 1.75675 12.6067 1.768 12.5452C1.852 12.1132 2.206 12.0075 2.509 12H13.75V1.5C13.75 1.10218 13.592 0.720644 13.3107 0.43934C13.0294 0.158035 12.6478 0 12.25 0ZM12.25 7.125L10 5.25L7.375 7.125V0H12.25V7.125Z"
      fill="#303E47"
    />
  </svg>
);

export const UserGuide = (color = '#303E47'): ReactElement => (
  <svg
    width={25}
    height={24}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.719 1.127v15.776c0 .352-.164.671-.417.873-.197.723-.197 2.784 0 3.507.253.207.417.526.417.878v.752c0 .624-.502 1.127-1.125 1.127H6.219a4.505 4.505 0 01-4.5-4.508V4.507A4.505 4.505 0 016.219 0h15.375c.623 0 1.125.502 1.125 1.127zM6.23 21.034h13.488c-.09-.802-.09-2.201 0-3.004H6.23c-.832 0-1.512.676-1.512 1.502 0 .831.676 1.503 1.512 1.503z"
      fill="#828285"
    />
    <mask
      id="prefix__a"
      style={{
        maskType: 'alpha'
      }}
      maskUnits="userSpaceOnUse"
      x={1}
      y={0}
      width={22}
      height={25}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.719 1.127v15.776c0 .352-.164.671-.417.873-.197.723-.197 2.784 0 3.507.253.207.417.526.417.878v.752c0 .624-.502 1.127-1.125 1.127H6.219a4.505 4.505 0 01-4.5-4.508V4.507A4.505 4.505 0 016.219 0h15.375c.623 0 1.125.502 1.125 1.127zM6.23 21.034h13.488c-.09-.802-.09-2.201 0-3.004H6.23c-.832 0-1.512.676-1.512 1.502 0 .831.676 1.503 1.512 1.503z"
        fill="#fff"
      />
    </mask>
    <g mask="url(#prefix__a)">
      <path fill={color} d="M.219 0h24v24h-24z" />
      <path fill="url(#prefix__pattern0)" d="M4.758 3.315h14.645v11.329H4.758z" />
      <mask
        id="prefix__b"
        style={{
          maskType: 'alpha'
        }}
        maskUnits="userSpaceOnUse"
        x={4}
        y={3}
        width={16}
        height={12}
      >
        <path fill="url(#prefix__pattern1)" d="M4.758 3.315h14.645v11.329H4.758z" />
      </mask>
      <g mask="url(#prefix__b)">
        <path fill="#F3F4F6" d="M4.758 3.315h14.645v11.329H4.758z" />
      </g>
    </g>
    <defs>
      <pattern id="prefix__pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
        <use xlinkHref="#prefix__image0_1224:74445" transform="scale(.00885 .01136)" />
      </pattern>
      <pattern id="prefix__pattern1" patternContentUnits="objectBoundingBox" width={1} height={1}>
        <use xlinkHref="#prefix__image0_1224:74445" transform="scale(.00885 .01136)" />
      </pattern>
      <image
        id="prefix__image0_1224:74445"
        width={113}
        height={88}
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export const AlarmBellIcon = (color?: string): ReactElement => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.36328 10.125H11.5508L10.9361 9.51034C10.7694 9.34365 10.6758 9.11756 10.6758 8.88182V7.5C10.6758 6.35706 9.94532 5.38473 8.92578 5.02437V4.875C8.92578 4.39175 8.53403 4 8.05078 4C7.56753 4 7.17578 4.39175 7.17578 4.875V5.02437C6.15624 5.38473 5.42578 6.35706 5.42578 7.5V8.88182C5.42578 9.11756 5.33213 9.34365 5.16544 9.51034L4.55078 10.125H6.73828M9.36328 10.125V10.5625C9.36328 11.2874 8.77565 11.875 8.05078 11.875C7.32591 11.875 6.73828 11.2874 6.73828 10.5625V10.125M9.36328 10.125H6.73828"
        stroke={color ? color : '#303E47'}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const InformationIcon = (color?: string): ReactElement => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.58333 9.33333H7V7H6.41667M7 4.66667H7.00583M12.25 7C12.25 9.89949 9.89949 12.25 7 12.25C4.1005 12.25 1.75 9.89949 1.75 7C1.75 4.1005 4.1005 1.75 7 1.75C9.89949 1.75 12.25 4.1005 12.25 7Z"
        stroke={color ? color : '#303E47'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AddFileIcon = (color?: string): ReactElement => {
  return (
    <svg width="37" height="46" viewBox="0 0 37 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.375 25.375H25.625M18.5 18.25L18.5 32.5M30.375 44.375H6.625C4.00165 44.375 1.875 42.2484 1.875 39.625V6.375C1.875 3.75165 4.00165 1.625 6.625 1.625H19.8912C20.5211 1.625 21.1252 1.87522 21.5706 2.32062L34.4294 15.1794C34.8748 15.6248 35.125 16.2289 35.125 16.8588V39.625C35.125 42.2484 32.9984 44.375 30.375 44.375Z"
        stroke={color ?? '#303E47'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ShowChartIcon = (color?: string, crossed?: boolean): ReactElement => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" fill="none" viewBox="0 0 18 19">
      <path
        stroke={color ?? '#2F446C'}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 14.25v-4.5a1.5 1.5 0 00-1.5-1.5h-1.5a1.5 1.5 0 00-1.5 1.5v4.5a1.5 1.5 0 001.5 1.5h1.5a1.5 1.5 0 001.5-1.5zm0 0v-7.5a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 011.5 1.5v7.5m-4.5 0a1.5 1.5 0 001.5 1.5h1.5a1.5 1.5 0 001.5-1.5m0 0V3.75a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5h-1.5a1.5 1.5 0 01-1.5-1.5z"
        opacity="0.89"
      ></path>
      {crossed && <path stroke="#45587C" d="M0.587 17.707L17.657 1.636"></path>}
    </svg>
  );
};

export const BuildingIcon = (color?: string): ReactElement => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_373_194696)">
        <path
          d="M2 14H14"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 5.33333H6.66667"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 8H6.66667" stroke="#303E47" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M6 10.6667H6.66667"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33333 5.33333H9.99999"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33333 8H9.99999"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33333 10.6667H9.99999"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.33333 14V3.33333C3.33333 2.97971 3.4738 2.64057 3.72385 2.39052C3.9739 2.14048 4.31304 2 4.66666 2H11.3333C11.6869 2 12.0261 2.14048 12.2761 2.39052C12.5262 2.64057 12.6667 2.97971 12.6667 3.33333V14"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_373_194696">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const PlantIcon = (color?: string): ReactElement => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_373_194689)">
        <path
          d="M12 2.66667H4C2.89543 2.66667 2 3.5621 2 4.66667V11.3333C2 12.4379 2.89543 13.3333 4 13.3333H12C13.1046 13.3333 14 12.4379 14 11.3333V4.66667C14 3.5621 13.1046 2.66667 12 2.66667Z"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.00001 8C6.73638 8 7.33334 7.40305 7.33334 6.66667C7.33334 5.93029 6.73638 5.33333 6.00001 5.33333C5.26363 5.33333 4.66667 5.93029 4.66667 6.66667C4.66667 7.40305 5.26363 8 6.00001 8Z"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 5.33333H11.3333"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 8H11.3333"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66667 10.6667H11.3333"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_373_194689">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const LineIcon = (color?: string): React.ReactElement => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_373_194684)">
        <path
          d="M12.6667 5.33333V10.6667C12.6667 10.8435 12.5964 11.013 12.4714 11.1381C12.3464 11.2631 12.1768 11.3333 12 11.3333H3.99999C3.82318 11.3333 3.65361 11.2631 3.52859 11.1381C3.40357 11.013 3.33333 10.8435 3.33333 10.6667V5.33333C3.33333 5.15652 3.40357 4.98695 3.52859 4.86193C3.65361 4.7369 3.82318 4.66666 3.99999 4.66666H12C12.1768 4.66666 12.3464 4.7369 12.4714 4.86193C12.5964 4.98695 12.6667 5.15652 12.6667 5.33333Z"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66667 14.6667V14C4.66667 13.8232 4.73691 13.6536 4.86193 13.5286C4.98696 13.4036 5.15653 13.3333 5.33334 13.3333H10.6667C10.8435 13.3333 11.0131 13.4036 11.1381 13.5286C11.2631 13.6536 11.3333 13.8232 11.3333 14V14.6667"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.3333 1.33334V2C11.3333 2.17681 11.2631 2.34638 11.1381 2.47141C11.0131 2.59643 10.8435 2.66667 10.6667 2.66667H5.33334C5.15653 2.66667 4.98696 2.59643 4.86193 2.47141C4.73691 2.34638 4.66667 2.17681 4.66667 2V1.33334"
          stroke={color ?? '#303E47'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_373_194684">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const MachineIcon = (color?: string): React.ReactElement => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.99999 4.8119C1.70978 4.8119 1.47368 5.04195 1.47368 5.32472C1.47368 5.60749 1.70978 5.83754 1.99999 5.83754C2.2902 5.83754 2.52631 5.60749 2.52631 5.32472C2.52631 5.04195 2.2902 4.8119 1.99999 4.8119Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M1.99999 3.38461C1.70978 3.38461 1.47368 3.61466 1.47368 3.89743C1.47368 4.1802 1.70978 4.41025 1.99999 4.41025C2.2902 4.41025 2.52631 4.1802 2.52631 3.89743C2.52631 3.61466 2.2902 3.38461 1.99999 3.38461Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M12.8305 6.45405H12.83C12.612 6.45405 12.4355 6.6262 12.4355 6.83866C12.4355 7.05113 12.6125 7.22328 12.8305 7.22328C13.0486 7.22328 13.2253 7.05113 13.2253 6.83866C13.2253 6.6262 13.0486 6.45405 12.8305 6.45405Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M8.13047 0.846154V0.384615C8.13047 0.172154 7.95379 0 7.73574 0H5.99889C5.78084 0 5.60416 0.172154 5.60416 0.384615V2.82928H4.07558V2.07692C4.07558 1.86446 3.89889 1.69231 3.68084 1.69231H0.394737C0.176684 1.69231 0 1.86446 0 2.07692V13.9231C0 14.1355 0.176684 14.3077 0.394737 14.3077H1.10711C0.958105 14.4864 0.868421 14.7138 0.868421 14.9614C0.868421 15.5341 1.34658 16 1.93432 16C2.52211 16 3.00026 15.5341 3.00026 14.9614C3.00026 14.7138 2.91058 14.4864 2.76158 14.3077H13.265C13.116 14.4864 13.0263 14.7138 13.0263 14.9614C13.0263 15.5341 13.5045 16 14.0922 16C14.68 16 15.1582 15.5341 15.1582 14.9614C15.1582 14.7138 15.0685 14.4864 14.9195 14.3077H15.6053C15.8233 14.3077 16 14.1355 16 13.9231V5.27041C16 5.05795 15.8233 4.8858 15.6053 4.8858H15.5526V2.92308C15.5526 2.71062 15.3759 2.53846 15.1579 2.53846H13.4211C13.203 2.53846 13.0263 2.71062 13.0263 2.92308V3.38462H12.9868C12.4862 3.38462 12.0789 2.98779 12.0789 2.5C12.0789 1.5881 11.3175 0.846154 10.3816 0.846154H8.13047ZM1.93432 15.2308C1.78189 15.2308 1.65789 15.1099 1.65789 14.9614C1.65789 14.8129 1.78189 14.6921 1.93432 14.6921C2.08674 14.6921 2.21079 14.8129 2.21079 14.9614C2.21079 15.1099 2.08674 15.2308 1.93432 15.2308ZM14.0922 15.2308C13.9398 15.2308 13.8158 15.1099 13.8158 14.9614C13.8158 14.8129 13.9398 14.6921 14.0922 14.6921C14.2446 14.6921 14.3687 14.8129 14.3687 14.9614C14.3687 15.1099 14.2446 15.2308 14.0922 15.2308ZM4.07558 4.87179H4.47368V5.46154C4.47368 5.60318 4.59147 5.71795 4.73684 5.71795H9.07895C9.22432 5.71795 9.34211 5.60318 9.34211 5.46154V4.87179H9.65905V7.96805H4.07558V4.87179ZM6.71074 4.15385H7.05284V5.20513H6.71074V4.15385ZM10.4485 7.96805V5.65503H15.2105V7.96805H10.4485ZM13.8158 3.30769H14.7632V4.8858H13.8158V3.30769ZM8.13047 1.61538H10.3816C10.8822 1.61538 11.2895 2.01221 11.2895 2.5C11.2895 3.4119 12.0509 4.15385 12.9868 4.15385H13.0263V4.8858H10.4485V3.2139C10.4485 3.00144 10.2718 2.82928 10.0538 2.82928H8.13042V1.61538H8.13047ZM8.13047 3.76923V3.59851H9.65911V4.35897H9.07895C8.93358 4.35897 8.81579 4.47374 8.81579 4.61538V5.20513H7.57916V4.15385H7.73568C7.95374 4.15385 8.13047 3.98169 8.13047 3.76923ZM6.39363 0.769231H7.341V3.38462H6.39363V0.769231ZM5.60416 3.59851V3.76923C5.60416 3.98169 5.78084 4.15385 5.99889 4.15385H6.18447V5.20513H5V4.61538C5 4.47374 4.88221 4.35897 4.73684 4.35897H4.07558V3.59851H5.60416ZM3.28611 13.5385H0.789474V2.46154H3.28611V13.5385ZM4.07558 8.79144H9.65911V13.5385H4.07558V8.79144ZM10.4485 13.5385V8.79144H15.2105V13.5385H10.4485Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M9.07894 6.89744H4.73684C4.59147 6.89744 4.47368 7.01221 4.47368 7.15385C4.47368 7.29549 4.59147 7.41026 4.73684 7.41026H9.07894C9.22431 7.41026 9.3421 7.29549 9.3421 7.15385C9.3421 7.01221 9.22431 6.89744 9.07894 6.89744Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M8.21052 11.9744H5.60526C5.45989 11.9744 5.3421 12.0891 5.3421 12.2308C5.3421 12.3724 5.45989 12.4872 5.60526 12.4872H8.21052C8.35589 12.4872 8.47368 12.3724 8.47368 12.2308C8.47368 12.0891 8.35589 11.9744 8.21052 11.9744Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M8.21052 11.1282H5.60526C5.45989 11.1282 5.3421 11.243 5.3421 11.3846C5.3421 11.5263 5.45989 11.641 5.60526 11.641H8.21052C8.35589 11.641 8.47368 11.5263 8.47368 11.3846C8.47368 11.243 8.35589 11.1282 8.21052 11.1282Z"
        fill={color ?? '#303E47'}
      />
      <path
        d="M6.86831 10.0769C7.08637 10.0769 7.26305 9.90477 7.26305 9.69231C7.26305 9.47985 7.08637 9.30769 6.86831 9.30769H6.86779C6.64979 9.30769 6.47331 9.47985 6.47331 9.69231C6.47331 9.90477 6.65031 10.0769 6.86831 10.0769Z"
        fill={color ?? '#303E47'}
      />
    </svg>
  );
};

export const TemplateIcon = (color?: string): ReactElement => {
  return (
    <svg width="37" height="46" viewBox="0 0 37 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.375 34.875V30.125M18.5 34.875V25.375M25.625 34.875V20.625M30.375 44.375H6.625C4.00165 44.375 1.875 42.2484 1.875 39.625V6.375C1.875 3.75165 4.00165 1.625 6.625 1.625H19.8912C20.5211 1.625 21.1252 1.87522 21.5706 2.32062L34.4294 15.1794C34.8748 15.6248 35.125 16.2289 35.125 16.8588V39.625C35.125 42.2484 32.9984 44.375 30.375 44.375Z"
        stroke={color ? color : '#111827'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const GearIcon = (color?: string): ReactElement => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.88333 1.878C6.16733 0.707333 7.83267 0.707333 8.11667 1.878C8.15928 2.05387 8.24281 2.21719 8.36047 2.35467C8.47813 2.49215 8.62659 2.5999 8.79377 2.66916C8.96094 2.73843 9.14211 2.76723 9.32252 2.75325C9.50294 2.73926 9.6775 2.68287 9.832 2.58867C10.8607 1.962 12.0387 3.13933 11.412 4.16867C11.3179 4.3231 11.2616 4.49756 11.2477 4.67785C11.2337 4.85814 11.2625 5.03918 11.3317 5.20625C11.4009 5.37333 11.5085 5.52172 11.6458 5.63937C11.7831 5.75702 11.9463 5.8406 12.122 5.88333C13.2927 6.16733 13.2927 7.83267 12.122 8.11667C11.9461 8.15928 11.7828 8.24281 11.6453 8.36047C11.5079 8.47813 11.4001 8.62659 11.3308 8.79377C11.2616 8.96094 11.2328 9.14211 11.2468 9.32252C11.2607 9.50294 11.3171 9.6775 11.4113 9.832C12.038 10.8607 10.8607 12.0387 9.83133 11.412C9.6769 11.3179 9.50244 11.2616 9.32215 11.2477C9.14186 11.2337 8.96082 11.2625 8.79375 11.3317C8.62667 11.4009 8.47828 11.5085 8.36063 11.6458C8.24298 11.7831 8.1594 11.9463 8.11667 12.122C7.83267 13.2927 6.16733 13.2927 5.88333 12.122C5.84072 11.9461 5.75719 11.7828 5.63953 11.6453C5.52187 11.5079 5.37341 11.4001 5.20623 11.3308C5.03906 11.2616 4.85789 11.2328 4.67748 11.2468C4.49706 11.2607 4.3225 11.3171 4.168 11.4113C3.13933 12.038 1.96133 10.8607 2.588 9.83133C2.68207 9.6769 2.73837 9.50244 2.75232 9.32215C2.76628 9.14186 2.7375 8.96082 2.66831 8.79375C2.59913 8.62667 2.49151 8.47828 2.35418 8.36063C2.21686 8.24298 2.05371 8.1594 1.878 8.11667C0.707333 7.83267 0.707333 6.16733 1.878 5.88333C2.05387 5.84072 2.21719 5.75719 2.35467 5.63953C2.49215 5.52187 2.5999 5.37341 2.66916 5.20623C2.73843 5.03906 2.76723 4.85789 2.75325 4.67748C2.73926 4.49706 2.68287 4.3225 2.58867 4.168C1.962 3.13933 3.13933 1.96133 4.16867 2.588C4.83267 2.99333 5.69933 2.63467 5.88333 1.878Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7C9 7.53043 8.78929 8.03914 8.41421 8.41421C8.03914 8.78929 7.53043 9 7 9C6.46957 9 5.96086 8.78929 5.58579 8.41421C5.21071 8.03914 5 7.53043 5 7C5 6.46957 5.21071 5.96086 5.58579 5.58579C5.96086 5.21071 6.46957 5 7 5C7.53043 5 8.03914 5.21071 8.41421 5.58579C8.78929 5.96086 9 6.46957 9 7V7Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ChevronThinIcon = (color?: string): ReactElement => {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.1417 0L0 1.175L3.7085 5L0 8.825L1.1417 10L6 5L1.1417 0Z"
        fill="currentColor"
        stroke={color ? color : '#A3A3A3'}
      />
    </svg>
  );
};

export const MoreIcon = (color?: string): ReactElement => {
  return (
    <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 2H2.01M9 2H9.01M16 2H16.01M3 2C3 2.55228 2.55228 3 2 3C1.44772 3 1 2.55228 1 2C1 1.44772 1.44772 1 2 1C2.55228 1 3 1.44772 3 2ZM10 2C10 2.55228 9.55228 3 9 3C8.44772 3 8 2.55228 8 2C8 1.44772 8.44772 1 9 1C9.55228 1 10 1.44772 10 2ZM17 2C17 2.55228 16.5523 3 16 3C15.4477 3 15 2.55228 15 2C15 1.44772 15.4477 1 16 1C16.5523 1 17 1.44772 17 2Z"
        stroke={color ? color : '#828285'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DataAnalysisFilterIcon = (color?: string, fillColor?: string): ReactElement => {
  return (
    <svg width="48" height="38" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="37"
        rx="7.5"
        fill={fillColor ? fillColor : 'white'}
      />
      <path
        d="M24 13V11M24 13C22.8954 13 22 13.8954 22 15C22 16.1046 22.8954 17 24 17M24 13C25.1046 13 26 13.8954 26 15C26 16.1046 25.1046 17 24 17M18 25C19.1046 25 20 24.1046 20 23C20 21.8954 19.1046 21 18 21M18 25C16.8954 25 16 24.1046 16 23C16 21.8954 16.8954 21 18 21M18 25V27M18 21V11M24 17V27M30 25C31.1046 25 32 24.1046 32 23C32 21.8954 31.1046 21 30 21M30 25C28.8954 25 28 24.1046 28 23C28 21.8954 28.8954 21 30 21M30 25V27M30 21V11"
        stroke={color ? color : '#303E47'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="0.5" y="0.5" width="47" height="37" rx="7.5" stroke="#E5E9ED" />
    </svg>
  );
};

export const RewindIcon = (color?: string): ReactElement => (
  <svg fill="none" height={20} width={20} xmlns="http://www.w3.org/2000/svg">
    <g stroke={color ?? '#5d6a86'} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}>
      <path d="M10.056 9.334a.833.833 0 0 0 0 1.333L14.5 14a.833.833 0 0 0 1.333-.667V6.667A.833.833 0 0 0 14.5 6zM3.389 9.334a.833.833 0 0 0 0 1.333L7.833 14a.833.833 0 0 0 1.334-.667V6.667A.833.833 0 0 0 7.833 6z" />
    </g>
  </svg>
);

export const InfoCircleIcon = (color?: string): ReactElement => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00001C14.6667 4.31811 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33333 4.31811 1.33333 8.00001C1.33333 11.6819 4.3181 14.6667 8 14.6667Z"
      stroke={color ?? 'black'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 5.33334V8.00001"
      stroke={color ?? 'black'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 10.6667H8.00667"
      stroke={color ?? 'black'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BellIcon = ({
  width,
  color,
  srLabel
}: {
  width?: string;
  color?: string;
  srLabel?: string;
}): ReactElement => {
  const Svg = styled.svg.attrs(({ width }) => ({
    width: width || `100%`,
    height: width || `auto`,
    viewBox: '0 0 21 21',
    fill: 'none'
  }))``;
  return (
    <Svg
      {...{ width, color }}
      className="icon--pencil icon"
      focusable="true"
      aria-label={srLabel || `edit`}
    >
      <path
        d="M9.00033 11.3333H2.66699C3.03028 11.1276 3.3402 10.8395 3.57178 10.4921C3.80337 10.1447 3.95016 9.7478 4.00033 9.33333V7.33333C4.04003 6.48738 4.30919 5.66818 4.77896 4.96353C5.24872 4.25888 5.90139 3.69535 6.66699 3.33333C6.66699 2.97971 6.80747 2.64057 7.05752 2.39052C7.30757 2.14048 7.6467 2 8.00033 2C8.35395 2 8.69309 2.14048 8.94313 2.39052C9.19318 2.64057 9.33366 2.97971 9.33366 3.33333C10.0993 3.69535 10.7519 4.25888 11.2217 4.96353C11.6915 5.66818 11.9606 6.48738 12.0003 7.33333"
        stroke={color ? color : '#0076CC'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.776 8.77444C11.8648 8.40852 12.3852 8.40852 12.474 8.77444C12.5314 9.01082 12.8022 9.12299 13.01 8.99643C13.3315 8.8005 13.6995 9.16848 13.5036 9.49004C13.377 9.69776 13.4892 9.96858 13.7256 10.026C14.0915 10.1148 14.0915 10.6352 13.7256 10.724C13.4892 10.7814 13.377 11.0522 13.5036 11.26C13.6995 11.5815 13.3315 11.9495 13.01 11.7536C12.8022 11.627 12.5314 11.7392 12.474 11.9756C12.3852 12.3415 11.8648 12.3415 11.776 11.9756C11.7186 11.7392 11.4478 11.627 11.24 11.7536C10.9185 11.9495 10.5505 11.5815 10.7464 11.26C10.873 11.0522 10.7608 10.7814 10.5244 10.724C10.1585 10.6352 10.1585 10.1148 10.5244 10.026C10.7608 9.96858 10.873 9.69776 10.7464 9.49004C10.5505 9.16848 10.9185 8.8005 11.24 8.99643C11.4478 9.12299 11.7186 9.01082 11.776 8.77444Z"
        stroke={color ? color : '#0076CC'}
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 10.375C12.75 10.7202 12.4702 11 12.125 11C11.7798 11 11.5 10.7202 11.5 10.375C11.5 10.0298 11.7798 9.75 12.125 9.75C12.4702 9.75 12.75 10.0298 12.75 10.375Z"
        stroke={color ? color : '#0076CC'}
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 11.334V12.0007C5.99954 12.4898 6.17834 12.9621 6.50258 13.3283C6.82683 13.6946 7.27403 13.9293 7.75962 13.988C8.2452 14.0468 8.7355 13.9256 9.13777 13.6474C9.54004 13.3691 9.82639 12.9531 9.94267 12.478"
        stroke={color ? color : '#0076CC'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
