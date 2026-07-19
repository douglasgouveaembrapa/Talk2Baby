import { AudioModule, RecordingPresets, useAudioRecorder } from 'expo-audio';
import { useCallback } from 'react';

/**
 * Encapsula a gravação de áudio (expo-audio, SDK 53+).
 * start() pede permissão na primeira vez; stop() devolve a URI do arquivo.
 */
export function useRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const start = useCallback(async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      throw new Error('Permissão de microfone negada');
    }
    await AudioModule.setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [recorder]);

  const stop = useCallback(async (): Promise<string> => {
    await recorder.stop();
    if (!recorder.uri) throw new Error('Gravação sem arquivo de áudio');
    return recorder.uri;
  }, [recorder]);

  return { start, stop };
}
