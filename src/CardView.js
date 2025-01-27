import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";

import FastImage from "react-native-fast-image";

import defaultIcons from "./Icons";
import FlipCard from "react-native-flip-card";

const { width } = Dimensions.get("window");
const BASE_SIZE = { width: width - 30, height: (190 * (width - 30)) / 300 };

const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {},
  icon: {
    position: "absolute",
    top: (15 * BASE_SIZE.height) / 190,
    right: (15 * BASE_SIZE.width) / 300,
    width: (60 * BASE_SIZE.width) / 300,
    height: (40 * BASE_SIZE.height) / 190,
    resizeMode: "contain",
  },
  baseText: {
    color: "rgba(255, 255, 255, 0.8)",
    backgroundColor: "transparent",
  },
  placeholder: {
    color: "rgba(255, 255, 255, 0.5)",
  },
  focused: {
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  },
  number: {
    fontSize: 21,
    position: "absolute",
    top: (95 * BASE_SIZE.height) / 190,
    left: (28 * BASE_SIZE.width) / 300,
  },
  name: {
    fontSize: 16,
    position: "absolute",
    bottom: (20 * BASE_SIZE.height) / 190,
    left: (25 * BASE_SIZE.width) / 300,
    right: (100 * BASE_SIZE.width) / 300,
  },
  expiryLabel: {
    fontSize: 9,
    position: "absolute",
    bottom: (40 * BASE_SIZE.height) / 190,
    left: (218 * BASE_SIZE.width) / 300,
  },
  expiry: {
    fontSize: 16,
    position: "absolute",
    bottom: (20 * BASE_SIZE.height) / 190,
    left: (220 * BASE_SIZE.width) / 300,
  },
  amexCVC: {
    fontSize: 16,
    position: "absolute",
    top: (73 * BASE_SIZE.height) / 190,
    right: (30 * BASE_SIZE.width) / 300,
  },
  cvc: {
    fontSize: 16,
    position: "absolute",
    top: (80 * BASE_SIZE.height) / 190,
    right: (30 * BASE_SIZE.width) / 300,
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CardView extends Component {
  static propTypes = {
    focused: PropTypes.string,

    brand: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.string,
    expiry: PropTypes.string,
    cvc: PropTypes.string,
    placeholder: PropTypes.object,

    scale: PropTypes.number,
    fontFamily: PropTypes.string,
    imageFront: PropTypes.number,
    imageBack: PropTypes.number,
    customIcons: PropTypes.object,
  };

  static defaultProps = {
    name: "",
    placeholder: {
      number: "•••• •••• •••• ••••",
      name: "FULL NAME",
      expiry: "••/••",
      cvc: "•••",
    },

    scale: 1,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    imageFront: require("../images/card-front.png"),
    imageBack: require("../images/card-back.png"),
  };

  render() {
    const { focused,
      brand, name, number, expiry, cvc, customIcons,
      placeholder, imageFront, imageBack, scale, fontFamily } = this.props;

    const Icons = { ...defaultIcons, ...customIcons };
    const isAmex = brand === "american-express";
    const shouldFlip = !isAmex && focused === "cvc";

    const containerSize = { width: BASE_SIZE.width * scale, height: BASE_SIZE.height * scale };

    let transform;
    if (scale === 0.8) {
      transform = {
        transform: [
          { scale },
          // { translateY: ((BASE_SIZE.height * (scale - 1) / 2)) },
          { translateY: -27.5 },
          { translateX: -43 },
        ],
      };
    } else {
      transform = {
        transform: [
          { scale },
          { translateY: ((BASE_SIZE.height * (scale - 1) / 2)) },
        ],
      };
    }

    return (
      <View style={containerSize}>
        <FlipCard style={{ borderWidth: 0 }}
          flipHorizontal
          flipVertical={false}
          friction={10}
          perspective={2000}
          clickable={false}
          flip={shouldFlip}>
          <FastImage style={[BASE_SIZE, transform]}
            source={imageFront}>
            <FastImage style={[s.icon]}
              source={Icons[brand]} />
            <Text style={[s.baseText, { fontFamily }, s.number, !number && s.placeholder, focused === "number" && s.focused]}>
              {!number ? placeholder.number : number}
            </Text>
            <Text style={[s.baseText, { fontFamily }, s.name, !name && s.placeholder, focused === "name" && s.focused]}
              numberOfLines={1}>
              {!name ? placeholder.name : name.toUpperCase()}
            </Text>
            <Text style={[s.baseText, { fontFamily }, s.expiryLabel, s.placeholder, focused === "expiry" && s.focused]}>
              MONTH/YEAR
              </Text>
            <Text style={[s.baseText, { fontFamily }, s.expiry, !expiry && s.placeholder, focused === "expiry" && s.focused]}>
              {!expiry ? placeholder.expiry : expiry}
            </Text>
            {isAmex &&
              <Text style={[s.baseText, { fontFamily }, s.amexCVC, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
                {!cvc ? placeholder.cvc : cvc}
              </Text>}
          </FastImage>
          <FastImage style={[BASE_SIZE, transform]}
            source={imageBack}>
            <Text style={[s.baseText, s.cvc, !cvc && s.placeholder, focused === "cvc" && s.focused]}>
              {!cvc ? placeholder.cvc : cvc}
            </Text>
          </FastImage>
        </FlipCard>
      </View>
    );
  }
}
