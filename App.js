import React, { Component } from 'react';
// import { Audio } from 'expo';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const ukulele = require('./assets/images/ukulele.png');
const drums = require('./assets/images/drums.png');
const mp3Ukulele = require('./assets/music/ukulele.mp3');
const mp3Drums = require('./assets/music/drums.mp3');

export default class App extends Component {
  state = {
    isPlayingUkulele: false,
    isPlayingDrums: false,
    isUkuleleCurrentSound: false,
    isDrumsCurrentSound: false,
    //isPlaying: false,
    playbackInstance: null,
    isBuffering: false,
    volume: 1.0,
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudioUkulele();
  }


  handlePlayPauseUkulele = async () => {
    const { playbackInstance, isDrumsCurrentSound } = this.state;
    if (isDrumsCurrentSound) {
      await playbackInstance.unloadAsync();
      await this.loadAudioUkulele();
    }
    // call to the new function
    this.playPauseUkulele();
  }

  playPauseUkulele = async () => {
    const { isPlayingUkulele, playbackInstance } = this.state;
    isPlayingUkulele ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlayingUkulele: !isPlayingUkulele,
      isUkuleleCurrentSound: true,
      isDrumsCurrentSound: false
    });
  }

  handlePlayPauseDrums = async () => {
    const { playbackInstance, isUkuleleCurrentSound } = this.state;
    if (isUkuleleCurrentSound) {
      await playbackInstance.unloadAsync();
      await this.loadAudioDrums();
    }
    // call to the new function
    this.playPauseDrums();
  }

  playPauseDrums = async () => {
    const { isPlayingDrums, playbackInstance } = this.state;
    isPlayingDrums ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlayingDrums: !isPlayingDrums,
      isDrumsCurrentSound: true,
      isUkuleleCurrentSound: false
    });
  }

  async loadAudioUkulele() {
    const playbackInstance = new Audio.Sound();
		const status = {
			shouldPlay: this.state.isPlayingUkulele,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(require('./assets/music/ukulele.mp3'), status, false);
    this.setState({
      playbackInstance
    });
  }

  async loadAudioDrums() {
    const playbackInstance = new Audio.Sound();
		const status = {
			shouldPlay: this.state.isPlayingDrums,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(require('./assets/music/drums.mp3'), status, false);
    this.setState({
      playbackInstance
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.pageHeader}>Aloha Music</Text>
        <Image source={ukulele} style={styles.pageImgs} />
        <TouchableOpacity
          style={styles.control}
          onPress={this.handlePlayPauseUkulele}
        >
          {this.state.isPlayingUkulele ?
              <Feather name="pause" size={32} color="#000"/> :
              <Feather name="play" size={32} color="#000"/>
            }
        </TouchableOpacity>

        <Image source={drums} style={styles.pageImgs} />
        <TouchableOpacity
          style={styles.control}
          onPress={this.handlePlayPauseDrums}
        >
          {this.state.isPlayingDrums ?
              <Feather name="pause" size={32} color="#000"/> :
              <Feather name="play" size={32} color="#000"/>
            }
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pageHeader: {
    width: 350,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#da9547',
    marginTop: 40,
  },
  pageImgs: {
    height: 210,
    width: 350,
    marginBottom: 40,
    marginTop: 40,
  }
});
