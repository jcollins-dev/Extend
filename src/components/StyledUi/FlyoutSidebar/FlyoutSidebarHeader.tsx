import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTimes, faPencil } from '@fortawesome/free-solid-svg-icons';
import { IconButton, HeaderSection, Title } from './FlyoutSidebar.elements';

interface FlyoutHeaderProps {
    onClose?: () => void,
    onBack?: () => void,
    header?: string,
    isAdmin?: boolean,
    handleAdminCallback?: () => void;
}

export const Header = ({ onBack, onClose, header, isAdmin, handleAdminCallback }: FlyoutHeaderProps): JSX.Element => {

    return (
        <HeaderSection>
             <Title>{ header }{ isAdmin && <IconButton><FontAwesomeIcon onClick={() => handleAdminCallback?.()} icon={faPencil} /></IconButton> }</Title>
            { onBack && <IconButton><FontAwesomeIcon onClick={() => onBack()} icon={faChevronLeft} /></IconButton> }
            { onClose && <IconButton><FontAwesomeIcon onClick={() => onClose()} icon={faTimes} /></IconButton> }
        </HeaderSection>
    )
}