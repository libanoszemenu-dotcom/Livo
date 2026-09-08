// የማሳወቂያ ድምጾች
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.loadSounds();
  }

  loadSounds() {
    // ለአሁን በWeb Audio API በመጠቀም ድምጽ መፍጠር
    this.sounds = {
      notification: this.createNotificationSound(),
      message: this.createMessageSound(),
      typing: this.createTypingSound(),
    };
  }

  createNotificationSound() {
    // አጭር የማሳወቂያ ድምጽ
    return () => {
      try {
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.3;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);

        // ሁለተኛ ድምጽ
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.type = "sine";
          osc2.frequency.value = 1100;
          gain2.gain.value = 0.2;
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.15);
        }, 150);
      } catch (error) {
        console.log("Audio not supported");
      }
    };
  }

  createMessageSound() {
    return () => {
      try {
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = 660;
        gainNode.gain.value = 0.2;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.log("Audio not supported");
      }
    };
  }

  createTypingSound() {
    return () => {
      try {
        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
      } catch (error) {
        console.log("Audio not supported");
      }
    };
  }

  play(type = "notification") {
    if (!this.enabled) return;
    const sound = this.sounds[type];
    if (sound) {
      try {
        sound();
      } catch (error) {
        console.log("Error playing sound:", error);
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundManager = new SoundManager();

// ለአጠቃላይ ጥቅም
export const playNotification = () => soundManager.play("notification");
export const playMessage = () => soundManager.play("message");
export const playTyping = () => soundManager.play("typing");
export const toggleSound = () => soundManager.toggle();
