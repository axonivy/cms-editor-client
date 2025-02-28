import { hotkeyText } from '@axonivy/ui-components';
import { useMemo } from 'react';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: `Open Help (${hotkeyText(hotkey)})` };
  }, []);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: `Focus Toolbar (${hotkeyText(hotkey)})` };
  }, []);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: `Focus Main (${hotkeyText(hotkey)})` };
  }, []);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: `Focus Inscription (${hotkeyText(hotkey)})` };
  }, []);

  return { openHelp, focusToolbar, focusMain, focusInscription };
};
