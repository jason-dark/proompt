import omelette from 'omelette';

import { getCommandModules } from '@/commands';

/**
 * Set up shell completion for proompt commands
 */
export const setupCompletion = (): omelette.Instance => {
  const complete = omelette('proompt <command>');
  const commandModules = getCommandModules();
  const commandNames = commandModules.map((module) => module.config.name);

  complete.on(
    'command',
    ({ reply }: { reply: (suggestions: string[]) => void }) => {
      reply(commandNames);
    }
  );

  complete.init();
  return complete;
};
