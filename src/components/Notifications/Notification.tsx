import React, { ReactElement } from 'react';
import { Flyout, FlyoutHeader } from 'components';
import { useState } from 'react';
import bell from '../../img/bell.svg';

const Notification = (): ReactElement => {
  const [openNotification, setOpenNotification] = useState(false);

  const onClickNotification = () => {
    setOpenNotification(!openNotification);
  };
  return (
    <>
      <div style={{ paddingTop: 5 }} onClick={onClickNotification}>
        <img src={bell} alt="bell" />
      </div>
      {openNotification && (
        <Flyout width="28.125rem" visible={openNotification} onClose={onClickNotification}>
          <FlyoutHeader heading={'Notifications'} onClose={onClickNotification} bgColor={'gray'} />
        </Flyout>
      )}
    </>
  );
};

export default Notification;
