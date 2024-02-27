import { useState, useRef, useEffect } from 'react';
import { createVonageNoiseSuppression } from '@vonage/noise-suppression';

export function useMediaProcessor() {
  const processorRef = useRef(null);
  const connectorRef = useRef(null);

  // Processor init
  const init = async () => {
    if (processorRef.current) return;
    try {
      processorRef.current = createVonageNoiseSuppression();
      await processorRef.current.init();
      connectorRef.current = await processorRef.current.getConnector();
    } catch (error) {
      console.log(error);
    }
  };
  const enableProcessor = async () => {
    if (!processorRef.current) {
      await init();
    }
    try {
      await processorRef.current.enable();
      return processorRef.current;
    } catch (error) {
      console.log(error);
    }
  };
  const disableProcessor = async () => {
    if (!processorRef.current) {
      return;
    }
    try {
      await processorRef.current.disable();
    } catch (error) {
      console.log(error);
    }
  };

  const suppressNoiseFromAudioStream = async (source) => {
    try {
      if (!processorRef.current) {
        await init();
        await processorRef.current.enable();
      }
      const track = await connectorRef.current.setTrack(source.getAudioTracks()[0]);
      const output = new MediaStream();
      output.addTrack(track);
      return output;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init().then().catch(console.log);
  }, []);

  return {
    processor: processorRef.current,
    connector: connectorRef.current,
    enableProcessor,
    disableProcessor,
    suppressNoiseFromAudioStream,
  };
}
