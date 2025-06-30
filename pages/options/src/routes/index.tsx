import QBittorrentIcon from '../assets/qBittorrent.svg?react';
import { useStorage } from '@extension/shared';
import { CLIENTS, configStore, serverStore } from '@extension/storage';
import { ServerSettingSchema, ServerSettingsSchema } from '@extension/storage/lib/base';
import {
  Button,
  Form,
  Input,
  Label,
  List,
  ListColGrow,
  ListColWrap,
  ListRow,
  Radio,
  Select,
  SelectOption,
} from '@extension/ui';
import { ErrorMessage } from '@hookform/error-message';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import type { ServerSettings } from '@extension/storage';
import type { SubmitHandler } from 'react-hook-form';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const servers = useStorage(serverStore);
  const { currentServer } = useStorage(configStore);
  const index = servers.findIndex(item => item.name === currentServer);

  const [items, setItems] = useState<ServerSettings[]>(servers);
  const [newItem, setItem] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(index !== -1 ? index : 0);

  const onSubmit = (data: ServerSettings) => {
    serverStore.set([...items, data]);
    setItems([...items, data]);
    setItem(false);
  };

  const onEdit = (data: ServerSettings) => {
    const newItems = [...items];
    newItems[selected] = data;
    serverStore.set(newItems);
    setItems(newItems);
  };

  const handleSelect = (index: number) => {
    configStore.set(store => ({ ...store, currentServer: items[index].name }));
    setSelected(index);
  };

  return (
    <div className="p-2">
      The leftmost server will be used as the <i>default</i> server for left-clicks, etc. Drag 'n drop to rearrange
      them. You can change the name after clicking on them.
      <div>
        <Button className="my-4" onClick={() => setItem(true)} disabled={!!newItem}>
          Add Server
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <List>
          {newItem && <RowItem onSubmit={onSubmit} />}
          {!items.length && !newItem && <li className="p-4 pb-2 text-xs tracking-wide opacity-60">no items</li>}
          {items?.map((item, i) => (
            <RowItem item={item} onClick={() => handleSelect(i)} selected={selected === i} />
          ))}
        </List>
        <EditItem item={items[selected]} onSubmit={onEdit} />
      </div>
    </div>
  );
}

const RowItem = ({
  item,
  selected = false,
  onSubmit,
  onClick,
}: {
  item?: ServerSettings;
  selected?: boolean;
  onSubmit?: (data: ServerSettings) => void;
  onClick?: () => void;
}) => {
  if (item) {
    return (
      <ListRow className="items-center" onClick={() => onClick?.()}>
        <Radio name="selected" value={item.name} onClick={() => onClick?.()} checked={selected} />
        <div>
          <QBittorrentIcon className="rounded-box size-10" />
        </div>
        <ListColGrow>
          <div>{item.name}</div>
          <div className="text-xs font-semibold uppercase opacity-60">{item.application}</div>
        </ListColGrow>
      </ListRow>
    );
  }

  return <NewItem onSubmit={data => onSubmit?.(data)} />;
};

const NewItem = (props: { onSubmit: (data: ServerSettings) => void }) => {
  const defaultValues: Partial<ServerSettings> = { name: '', application: CLIENTS.qbittorrent.id };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServerSettings>({
    defaultValues,
    resolver: standardSchemaResolver(ServerSettingsSchema),
    reValidateMode: 'onBlur',
  });

  const onSubmit: SubmitHandler<ServerSettings> = (data: ServerSettings) => {
    props.onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ListRow className="items-center">
        <Radio name="selected" disabled />
        <div>
          <QBittorrentIcon className="rounded-box size-10" />
        </div>
        <ListColGrow>
          <Label title="name" type="input" className="text-sm font-semibold uppercase" color={errors.name && 'error'}>
            <Input {...register('name')} />
          </Label>
        </ListColGrow>

        <ListColWrap className="">
          <div className="text-xs font-semibold uppercase">
            <Label title="client" type="select">
              <Select size="sm" {...register('application')}>
                {Object.values(CLIENTS).map(({ id, name }) => (
                  <SelectOption value={id} key={id}>
                    {name}
                  </SelectOption>
                ))}
              </Select>
            </Label>
          </div>
        </ListColWrap>

        <Button className="ml-4" color="success" type="submit">
          Submit
        </Button>
      </ListRow>
    </Form>
  );
};

const EditItem = ({ item, onSubmit }: { item?: ServerSettings; onSubmit: (data: ServerSettings) => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<ServerSettings>({
    defaultValues: item,
    resolver: standardSchemaResolver(ServerSettingSchema),
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    const { name } = getValues();
    if (name !== item?.name) reset(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.name, reset]);

  const debounce = useDebouncedCallback(
    handleSubmit(onSubmit, () => onSubmit(getValues())),
    300,
  );

  return (
    <Form className="flex flex-col gap-4" onChange={debounce}>
      <Label title="Name">
        <Input {...register('name')} color={errors.name && 'error'} />
        <ErrorMessage errors={errors} name="root" />
        <ErrorMessage errors={errors} name="name" />
      </Label>
      <Label title="Application">
        <Select {...register('application')} disabled>
          {Object.values(CLIENTS).map(({ name, id }) => (
            <SelectOption value={id} key={id}>
              {name}
            </SelectOption>
          ))}
        </Select>
        <ErrorMessage errors={errors} name="application" />
      </Label>

      <Label title="hostname">
        <Input {...register('hostname')} color={errors.hostname && 'error'} placeholder="http://hostname.tld" />
        <ErrorMessage errors={errors} name="hostname" />
      </Label>

      <Label title="Username">
        <Input {...register('username')} color={errors.username && 'error'} placeholder="Username" />
        <ErrorMessage errors={errors} name="username" />
      </Label>
      <Label title="Password">
        <Input {...register('password')} color={errors.password && 'error'} type="password" />
        <ErrorMessage errors={errors} name="password" />
      </Label>
    </Form>
  );
};
