import {LogBox} from 'react-native';

export const ignoreWarnings = () => {
  if (__DEV__) {
    const ignoreWarns = [
      'EventEmitter.removeListener',
      'ViewPropTypes will be removed from React Native',
      "exported from 'deprecated-react-native-prop-types'.",
      'Non-serializable values were found in the navigation state.',
      'VirtualizedLists should never be nested inside plain ScrollViews',
      'A non-serializable value was detected in the state, in the path: `alert.component.$$typeof`. Value: Symbol(react.element) Take a look at the reducer(s) handling this action type: loader/updatePreloader. (See https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state),',
    ];

    const warn = console.warn;
    console.warn = (...arg) => {
      for (const warning of ignoreWarns) {
        if (arg[0].startsWith(warning)) {
          return;
        }
      }
      warn(...arg);
    };

    LogBox.ignoreLogs(ignoreWarns);
  }
};
