import { Ban, Check, Copy, KeyRound, Plug, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, type ApiKey, type Grant } from '@/lib/api';
import { formatRelative } from '@/lib/format';
import { useI18n, useT } from '@/lib/i18n/context';
import { INTL_LOCALES } from '@/lib/i18n/locales';
import { Hint } from './Hint';
import { MCP_PATH } from '@/lib/mcp-facts';
import { Button } from '@/ui/components/Button';
import { CodeBlock, InlineCode } from '@/ui/components/Code';
import { IconButton } from '@/ui/components/IconButton';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ui/components/InputGroup';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@/ui/components/Modal';
import { Spinner } from '@/ui/components/Spinner';
import { toast } from '@/ui/components/Toast';
import { Typography } from '@/ui/components/Typography';

interface ApiKeysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeysDialog({ open, onOpenChange }: ApiKeysDialogProps) {
  const t = useT();
  const { locale } = useI18n();
  /* The tag `Intl` wants, which is not the tag in the address — see `INTL_LOCALES`. */
  const times = INTL_LOCALES[locale];
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [name, setName] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  /** The new key, held only until this dialog closes — the server will not show it again. */
  const [fresh, setFresh] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setFresh(null);
      setName('');
      return;
    }

    setIsLoading(true);
    api
      .listKeys()
      .then(setKeys)
      .catch((cause: Error) => toast.error(cause.message))
      .finally(() => setIsLoading(false));

    /*
     * Connected assistants are a separate list on purpose: a key is a secret you carry to a
     * machine, a grant is a client you let act as you. They are revoked differently and they mean
     * different things, and one list of both would invite revoking the wrong one.
     */
    api.listGrants().then(setGrants).catch(() => setGrants([]));
  }, [open]);

  const create = async () => {
    if (!name.trim()) {
      return;
    }

    setIsBusy(true);

    try {
      const created = await api.createKey(name.trim());

      setFresh(created.key);
      setKeys((current) => [created.created, ...current]);
      setName('');
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : t('dialog.keys.create.error')
      );
    } finally {
      setIsBusy(false);
    }
  };

  const revoke = async (key: ApiKey) => {
    setKeys((current) =>
      current.map((entry) =>
        entry.id === key.id
          ? { ...entry, revoked_at: new Date().toISOString() }
          : entry
      )
    );

    await api.revokeKey(key.id).catch((cause: Error) => {
      toast.error(cause.message);

      return api.listKeys().then(setKeys);
    });
  };

  /** Only offered on a key that is already revoked; the row is the last thing left of it. */
  const forget = async (key: ApiKey) => {
    setKeys((current) => current.filter((entry) => entry.id !== key.id));

    await api.forgetKey(key.id).catch((cause: Error) => {
      toast.error(cause.message);

      return api.listKeys().then(setKeys);
    });
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

  const copy = async () => {
    if (!fresh) {
      return;
    }

    try {
      await navigator.clipboard.writeText(fresh);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error(t('common.clipboard.error'));
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/*
        * The height is fixed on the dialog itself, not on the body: the body is a flex child with
        * `flex-1`, so its own height loses to the flex layout. Without this the dialog grew by half
        * a screen the moment a key was created and shrank again when it closed, moving whatever the
        * reader was looking at behind it.
        */}
      <ModalContent className="h-[30rem] max-w-xl">
        <ModalHeader>
          <ModalTitle>{t('dialog.keys.title')}</ModalTitle>
          <Typography variant="span" textColor="secondary" className="text-xs">
            {t('dialog.keys.blurb')}
          </Typography>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          {/* The create row stays where it is; a new key appears above it rather than replacing it. */}
          <div className="flex items-center gap-2">
            <InputGroup size="sm">
              <InputGroupAddon>
                <KeyRound className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                value={name}
                placeholder={t('dialog.keys.name.placeholder')}
                aria-label={t('dialog.keys.name.label')}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    void create();
                  }
                }}
              />
            </InputGroup>

            <Button
              variant="secondary"
              size="sm"
              leftSlot={<Plus />}
              disabled={isBusy || name.trim().length === 0}
              onClick={() => void create()}
            >
              {t('dialog.keys.create')}
            </Button>
          </div>

          {fresh && (
            <div className="flex shrink-0 flex-col gap-2 rounded-lg border border-brand-primary/40 bg-surface-accent p-3">
              <Typography variant="span" weight="semibold" textColor="primary">
                {t('dialog.keys.fresh')}
              </Typography>

              <div className="flex items-center gap-2">
                <InlineCode className="min-w-0 flex-1 truncate bg-surface-card px-2 py-1.5 text-ink-body">
                  {fresh}
                </InlineCode>
                <Button
                  variant="secondary"
                  size="sm"
                  leftSlot={isCopied ? <Check /> : <Copy />}
                  onClick={() => void copy()}
                >
                  {isCopied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>

              <CodeBlock
                language="bash"
                className="whitespace-pre-wrap border-0 bg-surface-card p-2"
              >
{`curl -H "Authorization: Bearer ${fresh.slice(0, 15)}…" \\
     --data-binary @README.md \\
     "${window.location.origin}/api/v1/documents?name=README.md&share=link"`}
              </CodeBlock>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 py-2">
              <Spinner />
              <Typography variant="span" textColor="secondary">
                {t('common.loading')}
              </Typography>
            </div>
          )}

          {!isLoading && keys.length === 0 && (
            <Typography variant="span" textColor="light" className="text-xs">
              {t('dialog.keys.empty')}
            </Typography>
          )}

          {/*
            * The list hugs its rows and scrolls past them, rather than stretching: a box pulled to
            * a fixed height around three keys reads as a list with something missing from it.
            */}
          {keys.length > 0 && (
            <ul className="flex min-h-0 flex-col divide-y divide-stroke overflow-y-auto rounded-md border border-stroke">
              {keys.map((key) => (
                <li
                  key={key.id}
                  className="flex shrink-0 items-center justify-between gap-3 px-3 py-2"
                >
                  <div className="flex min-w-0 flex-col">
                    <Typography
                      variant="span"
                      weight="medium"
                      textColor={key.revoked_at ? 'light' : 'primary'}
                      className="truncate"
                    >
                      {/* The name is a value in a sentence, not a fragment glued to one. */}
                      {key.revoked_at
                        ? t('dialog.keys.revoked', { name: key.name })
                        : key.name}
                    </Typography>
                    <Typography
                      variant="span"
                      textColor="secondary"
                      className="truncate font-mono text-xs"
                    >
                      {t('dialog.keys.meta', {
                        prefix: key.prefix,
                        used: key.last_used_at
                          ? t('dialog.keys.used', {
                              when: formatRelative(
                                new Date(key.last_used_at).getTime(),
                                times
                              ),
                            })
                          : t('dialog.keys.never'),
                      })}
                    </Typography>
                  </div>

                  {key.revoked_at ? (
                    <Hint content={t('dialog.keys.forget')}>
                      <IconButton
                        variant="destructiveTertiary"
                        size="sm"
                        aria-label={t('dialog.keys.forget.label', {
                          name: key.name,
                        })}
                        onClick={() => void forget(key)}
                      >
                        <Trash2 />
                      </IconButton>
                    </Hint>
                  ) : (
                    <Hint content={t('dialog.keys.revoke')}>
                      <IconButton
                        variant="destructiveTertiary"
                        size="sm"
                        aria-label={t('dialog.keys.revoke.label', {
                          name: key.name,
                        })}
                        onClick={() => void revoke(key)}
                      >
                        <Ban />
                      </IconButton>
                    </Hint>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/*
            * The connector's address, and the command that adds it.
            *
            * Shown whether or not anything is connected — before this, the only place to find the
            * address was the documentation, so the account menu could tell you what was connected
            * but not how to connect anything. Built from the running origin rather than written
            * down, so a preview deployment hands out its own address and not production's.
            */}
          <div className="flex shrink-0 flex-col gap-2">
            <Typography variant="span" textColor="light" className="text-xxs uppercase tracking-wide">
              {t('header.connector')}
            </Typography>

            <Typography variant="p" textColor="secondary" className="text-xs">
              {t('dialog.keys.connector.address')}
            </Typography>

            <CodeBlock className="text-xs">
              {`claude mcp add --transport http transformpipe ${window.location.origin}${MCP_PATH}`}
            </CodeBlock>
          </div>

          {grants.length > 0 && (
            <div className="flex shrink-0 flex-col gap-2">
              <Typography variant="span" textColor="light" className="text-xxs uppercase tracking-wide">
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
