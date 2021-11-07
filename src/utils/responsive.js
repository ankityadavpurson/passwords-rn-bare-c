import {Dimensions, Platform, PixelRatio} from 'react-native';
export const {width, height} = Dimensions.get('window');

// based on iphone 5s's scale
export const normalize = size => {
  const rounderPixel = Math.round(
    PixelRatio.roundToNearestPixel(size * (width / 280)),
  );
  return Platform.OS === 'ios' ? rounderPixel : rounderPixel - 2;
};
