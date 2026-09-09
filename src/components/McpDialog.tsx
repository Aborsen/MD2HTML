import { Ban, Check, Copy, Plug } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Hint } from './Hint';
import { api, type Grant } from '@/lib/api';
import { formatRelative } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { MCP_PATH } from '@/lib/mcp-facts';
import { Button } from '@/ui/components/Button';
import { CodeBlock } from '@/ui/components/Code';
import { IconButton } from '@/ui/components/IconButton';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/ui/components/Modal';
import { Typography } from '@/ui/components/Typography';
import { toast } from '@/ui/components/Toast';

/*
 * The connector: the address to add, and what is connected.
 *
 * Its own dialog rather than a section of the API keys one. Both are ways into the same account,
 * which was the argument for putting them together, and it was the wrong argument: a person opening
 * "MCP connector" from the menu and landing on a page headed "API keys" with a key generator at the
 * top has to work out that they are in the right place. The dialog is about one thing now.
 *
 * The address is built from the running origin rather than written down, so a preview deployment
 * hands out its own and not production's.
 */
export function McpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const { locale } = useI18n();
  const times = INTL_LOCALES[locale];

  const [grants, setGrants] = useState<Grant[]>([]);
  const [copied, setCopied] = useState<'url' | 'command' | null>(null);

  const url = `${window.location.origin}${MCP_PATH}`;
  const command = `claude mcp add --transport http transformpipe ${url}`;

  useEffect(() => {
    if (open) {
      void api.listGrants().then(setGrants).catch(() => setGrants([]));
    }
  }, [open]);

  const copy = async (what: 'url' | 'command', text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error(t('common.clipboard.error'));
    }
  };

  const disconnect = async (grant: Grant) => {
    setGrants((current) =>
      current.filter((entry) => entry.clientId !== grant.clientId)
    );

    await api.revokeGrant(grant.clientId).catch((cause: Error) => {
      toast.error(cause.message);

      return api.listGrants().then(setGrants);
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-[34rem]">
        <ModalHeader>
          <ModalTitle>{t('header.connector')}</ModalTitle>
          <Typography variant="p" textColor="secondary" className="text-sm">
            {t('dialog.mcp.lede')}
          </Typography>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-5">
          {/* The address on its own, because that is what somebody came here for. */}
          <div className="flex flex-col gap-2">
            <Typography
              variant="span"
              textColor="light"
              className="text-xxs uppercase tracking-wide"
            >
              {t('dialog.mcp.address')}
            </Typography>

            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-md border border-stroke bg-surface-card2 px-3 py-2 font-mono text-ink-primary text-sm">
                {url}
              </code>
              <Button
                variant="secondary"
                size="sm"
                leftSlot={copied === 'url' ? <Check /> : <Copy />}
                onClick={() => void copy('url', url)}
              >
                {copied === 'url' ? t('common.copied') : t('common.copy')}
              </Button>
            </div>

            <Typography variant="p" textColor="secondary" className="text-xs">
              {t('dialog.mcp.nokey')}
            </Typography>
          </div>

          {/* And the terminal one-liner, for anybody who would rather not click through settings. */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Typography
                variant="span"
                textColor="light"
                className="text-xxs uppercase tracking-wide"
              >
                {t('dialog.mcp.command')}
              </Typography>
              <Button
                variant="tertiary"
                size="sm"
                leftSlot={copied === 'command' ? <Check /> : <Copy />}
                onClick={() => void copy('command', command)}
              >
                {copied === 'command' ? t('common.copied') : t('common.copy')}
              </Button>
            </div>

            <CodeBlock className="text-xs">{command}</CodeBlock>
          </div>

          {grants.length > 0 && (
            <div className="flex shrink-0 flex-col gap-2">
              <Typography
                variant="span"
                textColor="light"
                className="text-xxs uppercase tracking-wide"
              >
                {t('dialog.keys.grants')}
              </Typography>

              <ul className="flex flex-col divide-y divide-stroke rounded-md border border-stroke">
                {grants.map((grant) => (
                  <li
                    key={grant.clientId}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Plug className="size-4 shrink-0 text-ink-secondary" />
                      <div className="flex min-w-0 flex-col">
                        <Typography
                          variant="span"
                          weight="medium"
                          textColor="primary"
                          className="truncate"
                        >
                          {grant.name}
                        </Typography>
                        <Typography
                          variant="span"
                          textColor="secondary"
                          className="truncate text-xs"
                        >
                          {t('dialog.keys.grant.meta', {
                            since: formatRelative(
                              new Date(grant.since).getTime(),
                              times
                            ),
                            used: grant.lastUsed
                              ? t('dialog.keys.used', {
                                  when: formatRelative(
                                    new Date(grant.lastUsed).getTime(),
                                    times
                                  ),
                                })
                              : t('dialog.keys.never'),
                          })}
                        </Typography>
                      </div>
                    </div>

                    <Hint content={t('dialog.keys.disconnect')}>
                      <IconButton
                        variant="destructiveTertiary"
                        size="sm"
                        aria-label={t('dialog.keys.disconnect.label', {
                          name: grant.name,
                        })}
                        onClick={() => void disconnect(grant)}
                      >
                        <Ban />
                      </IconButton>
                    </Hint>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
