import React, { ReactNode } from 'react';
import { Header } from './FlyoutSidebarHeader'; 


interface FlyoutProps {
    children?: ReactNode | ReactNode[],
    onClose: (() => void) | undefined,
    onBack?: () => void,
    heading?: string,
    afterComponent?: ReactNode | ReactNode[],
    bgColor?: string,
    isAdmin?: boolean,
    handleAdminCallback?: () => void;
}

export const FlyoutSidebar = ({
    children,
    onClose,
    onBack,
    heading,
    isAdmin,
    handleAdminCallback
}: FlyoutProps): JSX.Element => {

    const hasHeader = onClose || heading;

    const headerSettings = {
        onClose: onClose,
        onBack: onBack,
        header: heading,
        isAdmin,
        handleAdminCallback,
    }

    return (
        <>
            {hasHeader && <Header {...headerSettings} />}
            {children}
        </>
    )
}
