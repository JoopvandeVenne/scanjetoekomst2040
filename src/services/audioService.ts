const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playClickSound = () => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

export const playSuccessSound = () => {
  if (!audioContext) return;

  const notes = [523.25, 659.25, 783.99];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    const startTime = audioContext.currentTime + (index * 0.15);
    const endTime = startTime + 0.3;

    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  });
};
