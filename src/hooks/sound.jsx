import { SourceRounded } from '@mui/icons-material';
import { Howl, Howler } from 'howler';
import { useRef, useEffect, useState } from 'react';
// import sound from '../assets/sound.mp3';
function useSound() {
  const sound = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    sound.current = new Howl({
      src: [`${window.location.origin}/sound.mp3`],
      //   autoplay: true,
      loop: true,
      volume: 0.5,
      html5: true,
      onload: function () {
        console.log('loaded');
      },

      onend: function () {
        console.log('Finished!');
      },
    });
  }, []);

  const togglePlay = () => {
    if (!sound.current) return;
    if (playing) {
      sound.current.stop();
    } else {
      sound.current.play();
    }
    setPlaying((prev) => !prev);
  };

  return {
    playing,
    togglePlay,
  };
}
export default useSound;
