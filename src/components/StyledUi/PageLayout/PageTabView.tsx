import React, { ReactNode } from "react"
import { PageTabViewProps } from "./PageTabView.types"
import { PageTabViewContainer } from './PageLayout.elements'

interface Props extends PageTabViewProps {
  children?: ReactNode | ReactNode[]
}

export const PageTabView = ({ children, TabSubNav, HeaderRight }: Props): JSX.Element => {
  const hasHeader = TabSubNav || HeaderRight ? true : false
  return (
    <PageTabViewContainer className='ui-page-tab-view'>
      {hasHeader && <header className='ui-page-tab-view__header'>
        {TabSubNav && <nav className='ui-page-tab-view__sub-nav'>{TabSubNav}</nav>}
        {HeaderRight}
      </header>}
      {children}
    </PageTabViewContainer>
  )
}