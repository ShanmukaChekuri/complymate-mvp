import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button'; // I'll need a button component
import { Label } from '../ui/label'; // and a label
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'; // and a select
import { Settings, Sun, Moon } from 'lucide-react';
import useChatStore from '../../store/chatStore';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

export function SettingsPanel() {
  const { isDarkMode, toggleTheme, selectedVoiceURI, setSelectedVoiceURI } = useChatStore();
  const { voices, speak } = useSpeechSynthesis();

  const handleVoiceChange = (voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    const voice = voices.find((v: SpeechSynthesisVoice) => v.voiceURI === voiceURI);
    if (voice) {
      // Say a sample text to preview the voice
      const utterance = new SpeechSynthesisUtterance('This is the selected voice.');
      utterance.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Settings size={20} />
          <span className="ml-2">Settings</span>
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Customize your ComplyMate experience.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="theme-mode">Theme</Label>
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {isDarkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="voice-select">AI Voice</Label>
            <Select value={selectedVoiceURI || ''} onValueChange={handleVoiceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice: SpeechSynthesisVoice) => (
                  <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
