import { Check, Copy, Link2, Lock, Mail, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, type ShareMode, type ShareState } from '@/lib/api';
import { FilterChips } from './FilterChips';
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

interface ShareDialogProps {
  /** The document's id in the account; sharing needs a server-side row. */
  documentId: string | null;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shareUrl = (token: string) => `${window.location.origin}/s/${token}`;

export function ShareDialog({
  documentId,
  name,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [state, setState] = useState<ShareState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!open || !documentId) {
      return;
    }

    setIsBusy(true);
    api
      .getShare(documentId)
      .then(setState)
      .catch((cause: Error) => toast.error(cause.message))
      .finally(() => setIsBusy(false));
  }, [open, documentId]);

  if (!documentId) {
    return null;
  }

  const run = async (action: Promise<ShareState>) => {
    setIsBusy(true);

    try {
      setState(await action);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : 'Sharing failed');
    } finally {
      setIsBusy(false);
    }
  };

  const copyLink = async () => {
    if (!state?.token) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl(state.token));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Could not access the clipboard');
    }
  };

  const addRecipient = () => {
    const address = email.trim();

    if (address) {
      void run(api.addShareRecipient(documentId, address)).then(() =>
        setEmail('')
      );
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Share</ModalTitle>
          <Typography variant="span" textColor="secondary" className="text-xs">
            {name}
          </Typography>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <FilterChips
            value={state?.mode ?? 'private'}
            items={[
              { value: 'private', label: 'Private' },
              { value: 'link', label: 'Anyone with the link' },
              { value: 'people', label: 'Specific people' },
            ]}
            onValueChange={(value) =>
              void run(api.setShareMode(documentId, value as ShareMode))
            }
          />

          {isBusy && !state && (
            <div className="flex items-center gap-2 py-2">
              <Spinner />
              <Typography variant="span" textColor="secondary">
                Loading…
              </Typography>
            </div>
          )}

          {state?.mode === 'private' && (
            <Typography
              variant="p"
              textColor="secondary"
              className="flex items-start gap-2 text-xs"
            >
              <Lock className="mt-0.5 size-4 shrink-0" />
              Only you can open this document. Pick a mode above to share it.
            </Typography>
          )}

          {state && state.mode !== 'private' && state.token && (
            <div className="flex flex-col gap-2">
              <Typography
                variant="span"
                textColor="secondary"
                className="text-xs"
              >
                Link
              </Typography>

              <div className="flex items-center gap-2">
                <InputGroup size="sm">
                  <InputGroupAddon>
                    <Link2 className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    readOnly
                    value={shareUrl(state.token)}
                    aria-label="Share link"
                    onFocus={(event) => event.currentTarget.select()}
                  />
                </InputGroup>

                <Button
                  variant="secondary"
                  size="sm"
                  leftSlot={isCopied ? <Check /> : <Copy />}
                  onClick={() => void copyLink()}
                >
                  {isCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <Typography
                variant="p"
                textColor="secondary"
                className="flex items-start gap-2 text-xs"
              >
                {state.mode === 'link' ? (
                  <>
                    <Users className="mt-0.5 size-4 shrink-0" />
                    Anyone with this link can read the document.
                  </>
                ) : (
                  <>
                    <Mail className="mt-0.5 size-4 shrink-0" />
                    Only the people below can open it, after signing in with that
                    address. Send them the link yourself — the app does not email
                    anyone.
                  </>
                )}
              </Typography>
            </div>
          )}

          {state?.mode === 'people' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <InputGroup size="sm">
                  <InputGroupAddon>
                    <Mail className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    value={email}
                    type="email"
                    placeholder="name@company.com"
                    aria-label="Recipient email"
                    onChange={(event) => setEmail(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addRecipient();
                      }
                    }}
                  />
                </InputGroup>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={isBusy || email.trim().length === 0}
                  onClick={addRecipient}
                >
                  Add
                </Button>
              </div>

              {state.emails.length > 0 ? (
                <ul className="flex flex-col divide-y divide-stroke rounded-md border border-stroke">
                  {state.emails.map((address) => (
                    <li
                      key={address}
                      className="flex items-center justify-between gap-2 px-3 py-1.5"
                    >
                      <Typography
                        variant="span"
                        textColor="body"
                        className="truncate text-xs"
                      >
                        {address}
                      </Typography>

                      <IconButton
                        variant="destructiveTertiary"
                        size="xs"
                        aria-label={`Remove ${address}`}
                        disabled={isBusy}
                        onClick={() =>
                          void run(
                            api.removeShareRecipient(documentId, address)
                          )
                        }
                      >
                        <X />
                      </IconButton>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography
                  variant="span"
                  textColor="light"
                  className="text-xs"
                >
                  Nobody yet — the link opens for you only.
                </Typography>
              )}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
