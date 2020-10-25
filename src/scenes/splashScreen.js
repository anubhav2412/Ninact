import React, {useRef, useState, useEffect} from 'react';
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import fire from "../firebase";
import { Component } from 'react';
import { useNavigation } from '@react-navigation/native';

class ProgressBar extends Component {

  componentWillMount() {
    this.animation = new Animated.Value
    (this.props.progress)
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.progress != this.props.progress) {
      Animated.timing(this.animation, {
        toValue: this.props.progress,
        duration: this.props.duration
      }).start();
    }
  }

  render() {
    const {
      height,
      borderColor,
      borderWidth,
      borderRadius,
      barColor,
      fillColor,
      row,
    } = this.props;

    const widthInterpolated = this.animation.interpolate
    ({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
      extrapolate: "clamp"
    })

    return (
      <View style={[{flexDirection: "row", height },
      row ? {flex: 1} : undefined ]}>
        <View style={{ flex: 1, borderColor, borderWidth, borderRadius}}>
          <View
            style={[StyleSheet.absoluteFill, {
              backgroundColor: fillColor }]}
          />
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: widthInterpolated,
              backgroundColor: barColor
            }}
          />
        </View>
      </View>
    )
  }
}

ProgressBar.defaultProps = {
  height: 10,
  borderColor: "#000",
  borderWidth: 2,
  borderRadius: 4,
  barColor: "green",
  fillColor: "rgba(0, 0, 0, 1)",
  duration: 100
}

export default class splashScreen extends Component {

  state = {
    progress: 0,
  };

  componentDidMount() {
    setInterval(() => {
      if(this.state.progress < 100) {
        this.setState(state => ({
          progress: state.progress + 1,
        }));
      }
    }, 30);
  }

  check() {
    if(this.state.progress >= 100) {
      fire.auth().onAuthStateChanged((user) => {
        if (user) {
          this.props.navigation.navigate('HomeScreen')
        }
        else
        {
          this.props.navigation.navigate('loginScreen')
        }
      });
    }
}

render() {
  {this.check()}
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text>Loading... </Text>
          <ProgressBar
            row
            progress={this.state.progress}
            duration={100}
          />
          <Text>{`${this.state.progress}%`}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 250,
  },
  progressContainer: {
    alignItems: "center",
    flexDirection: "row"
  }
});

