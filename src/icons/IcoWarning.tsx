import React from 'react'
import styled from 'styled-components'
import { styledTheme } from 'components/StyledUi'

const Svg = styled.svg``


export const IcoWarning = ({ type }: ({ type?: string })): JSX.Element => {

  const color = (type === 'warning' || type === 'operations') ? styledTheme.color.status.warning : styledTheme.color.status.error

  return (
    <Svg width="21" height="18" viewBox="0 0 21 18" fill="none">
      <g clipPath="url(#clip0_43929_173904)">
        <path fill={color.base} d="M9.19926 1.4041L1.09246 14.6827C0.92532 14.9667 0.836881 15.2887 0.835945 15.6167C0.835009 15.9446 0.921609 16.2671 1.08713 16.552C1.25265 16.8369 1.49132 17.0744 1.7794 17.2407C2.06747 17.407 2.39491 17.4964 2.72914 17.5H18.9427C19.277 17.4964 19.6044 17.407 19.8925 17.2407C20.1806 17.0744 20.4192 16.8369 20.5847 16.552C20.7503 16.2671 20.8369 15.9446 20.8359 15.6167C20.835 15.2887 20.7466 14.9667 20.5794 14.6827L12.4726 1.4041C12.302 1.12811 12.0617 0.899922 11.7751 0.741558C11.4884 0.583195 11.1649 0.5 10.8359 0.5C10.5069 0.5 10.1835 0.583195 9.89682 0.741558C9.61013 0.899922 9.36989 1.12811 9.19926 1.4041Z" />
        <path d="M10.8359 7V10.3333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.8359 13.667H10.8443" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_43929_173904">
          <rect width="20" height="17" fill="white" transform="translate(0.835938 0.5)" />
        </clipPath>
      </defs>
    </Svg>
  )
}
