import React from 'react';
import {Modal} from 'react-native';
import {View} from 'react-native-animatable';
import {useSelector} from 'react-redux';
import {Preloader} from '../loaders';

//Use to wrap all the modals to opening aviod errors in ios
const ModalContainer = () => {
  const [showPreloader, setShowPreloader] = React.useState(false);
  const loader = useSelector(state => state.loader);
  const alert = useSelector(state => state.alert);

  React.useEffect(() => {
    setTimeout(() => {
      if (alert.visible) {
        setShowPreloader(true);
      } else {
        setShowPreloader(false);
      }
    }, 10);
  }, [alert.visible]);
  return (
    <Modal
      hardwareAccelerated={true}
      visible={loader.visible}
      transparent={true}>
      <Preloader.Loader />

      {/* {showAlertModal && <AlertModal.Modal />} */}
    </Modal>
  );
};

export default ModalContainer;
