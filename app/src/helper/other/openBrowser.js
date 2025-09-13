// import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {COLORS} from '../../conts';
import {openLink} from './openLink';

export const openBrowser = async url => {
  if (await InAppBrowser.isAvailable()) {
    try {
      const result = await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'close',
        preferredBarTintColor: '#453AA4',
        preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        toolbarColor: COLORS.primary,
        secondaryToolbarColor: 'black',
        navigationBarColor: 'black',
        navigationBarDividerColor: 'white',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
      });

      console.log(result, 'result');
    } catch (error) {
      openLink(url);
      console.log(error, 'browser error nowww ');
    }
  } else {
    console.log('not cheecjcjj');
    openLink(url);
  }
};
