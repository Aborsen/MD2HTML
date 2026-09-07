import { Check, Copy, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, type ApiKey } from '@/lib/api';
import { formatRelative } from '@/lib/format';
import { Hint } from './Hint';
import { Button } from '@/ui/components/Button';
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
  const [keys, setKeys] = useState<ApiKey[]>([]);
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
      toast.error(cause instanceof Error ? cause.message : 'Could not create the key');
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

  const copy = async () => {
    if (!fresh) {
      return;
    }

    try {
      await navigator.clipboard.writeText(fresh);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Could not access the clipboard');
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-xl">
        <ModalHeader>
          <ModalTitle>API keys</ModalTitle>
          <Typography variant="span" textColor="secondary" className="text-xs">
            Convert and share documents from a script, a terminal or CI.
          </Typography>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          {fresh ? (
            <div className="flex flex-col gap-2 rounded-lg border border-brand-primary/40 bg-surface-accent p-3">
              <Typography variant="span" weight="semibold" textColor="primary">
                Copy it now — it is not shown again
              </Typography>

              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded bg-surface-card px-2 py-1.5 font-mono text-ink-body text-xs">
                  {fresh}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  leftSlot={isCopied ? <Check /> : <Copy />}
                  onClick={() => void copy()}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <Typography
                variant="span"
                textColor="secondary"
                className="text-xs"
              >
                Publish a file in one request:
              </Typography>

              <pre className="overflow-x-auto rounded bg-surface-card p-2 font-mono text-ink-body text-xs">
{`curl -H "Authorization: Bearer ${fresh.slice(0, 15)}…" \\
     --data-binary @README.md \\
     "${window.location.origin}/api/v1/documents?name=README.md&share=link"`}
              </pre>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <InputGroup size="sm">
                <InputGroupAddon>
                  <KeyRound className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  value={name}
                  placeholder="What will use it — “CI”, “my laptop”"
                  aria-label="Key name"
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
                Create
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 py-2">
              <Spinner />
              <Typography variant="span" textColor="secondary">
                Loading…
              </Typography>
            </div>
          )}

          {!isLoading && keys.length === 0 && (
            <Typography variant="span" textColor="light" className="text-xs">
              No keys yet. A key can read, write and share your documents — it
              cannot touch your account or these keys.
            </Typography>
          )}

          {keys.length > 0 && (
            <ul className="flex flex-col divide-y divide-stroke rounded-md border border-stroke">
              {keys.map((key) => (
                <li
                  key={key.id}
                  className="flex items-center justify-between gap-3 px-3 py-2"
                >
                  <div className="flex min-w-0 flex-col">
                    <Typography
                      variant="span"
                      weight="medium"
                      textColor={key.revoked_at ? 'light' : 'primary'}
                      className="truncate"
                    >
                      {key.name}
                      {key.revoked_at ? ' · revoked' : ''}
                    </Typography>
                    <Typography
                      variant="span"
                      textColor="secondary"
                      className="truncate font-mono text-xs"
                    >
                      {key.prefix}… ·{' '}
                      {key.last_used_at
                        ? `used ${formatRelative(new Date(key.last_used_at).getTime())}`
                        : 'never used'}
                    </Typography>
                  </div>

                  {!key.revoked_at && (
                    <Hint content="Revoke">
                      <IconButton
                        variant="destructiveTertiary"
                        size="sm"
                        aria-label={`Revoke ${key.name}`}
                        onClick={() => void revoke(key)}
                      >
                        <Trash2 />
                      </IconButton>
                    </Hint>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
