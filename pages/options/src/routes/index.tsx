import {
  Button,
  Checkbox,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { SERVER_TYPES } from '@src/constants/clients';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import QBittorrentIcon from '../assets/qBittorrent.svg?react';
import { useDebouncedCallback } from 'use-debounce';
import { createStorage, StorageEnum } from '@extension/storage/lib/base';

export const Route = createFileRoute('/')({
  component: Index,
});

const ServerSchema = z.object({
  name: z.string().min(1, 'Required'),
  type: z.enum(SERVER_TYPES),
  host: z.string().optional(),
  port: z.string().optional(),
  ssl: z.boolean().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
});

type Server = z.infer<typeof ServerSchema>;

const servers = createStorage(
  'servers',
  [
    {
      name: 'PRIMARY SERVER',
      host: '127.0.0.1:6883',
      ssl: false,
      username: 'login',
      password: 'password',
      type: 'Vuze SwingUI',
    },
  ] as Server[],
  { storageEnum: StorageEnum.Local },
);

createStorage('linksfoundindicator', true, { storageEnum: StorageEnum.Local });
createStorage('showpopups', true, { storageEnum: StorageEnum.Local });
createStorage('popupduration', 2000, { storageEnum: StorageEnum.Local });
createStorage('catchfromcontextmenu', true, { storageEnum: StorageEnum.Local });
createStorage('catchfrompage', true, { storageEnum: StorageEnum.Local });
createStorage('linkmatches', '([\\]\\[]|\\b|\\.)\\.torrent\\b([^\\-]|$)~torrents\\.php\\?action=download', {
  storageEnum: StorageEnum.Local,
});

function Index() {
  const [items, setItems] = useState<Server[]>([]);
  const [newItem, setItem] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    servers.get().then(servers => {
      setItems(servers);
    });
  }, []);

  const onSubmit = (data: Server) => {
    servers.set([...items, data]);
    setItems([...items, data]);
    setItem(false);
  };

  const onEdit = (data: Server) => {
    const newItems = [...items];
    newItems[selected] = data;
    servers.set(newItems);
    setItems(newItems);
  };

  return (
    <div className="p-2">
      The leftmost server will be used as the <i>default</i> server for left-clicks, etc. Drag 'n drop to rearrange
      them. You can change the name after clicking on them.
      <br />
      <br />
      <Button onClick={() => setItem(true)} disabled={!!newItem}>
        Add Server
      </Button>
      <br />
      <br />
      <div className="grid grid-cols-2 gap-2">
        <List>
          {newItem && <RowItem onSubmit={onSubmit} />}
          {!items.length && !newItem && <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">no items</li>}
          {items?.map((item, i) => <RowItem item={item} onClick={() => setSelected(i)} />)}
        </List>
        <EditItem item={items[selected]} onSubmit={onEdit} />
      </div>
    </div>
  );
}

const RowItem = ({
  item,
  onSubmit,
  onClick,
}: {
  item?: Server;
  onSubmit?: (data: Server) => void;
  onClick?: () => void;
}) => {
  if (item) {
    return (
      <ListRow className="items-center" onClick={() => onClick?.()}>
        <Radio name="selected" onClick={() => onClick?.()} />
        <div>
          <QBittorrentIcon className="size-10 rounded-box" />
        </div>
        <ListColGrow>
          <div>{item.name}</div>
          <div className="text-xs uppercase font-semibold opacity-60">{item.type}</div>
        </ListColGrow>
      </ListRow>
    );
  }

  return <NewItem onSubmit={data => onSubmit?.(data)} />;
};

const NewItem = (props: { onSubmit: (data: Server) => void }) => {
  const defaultValues = { name: '', type: SERVER_TYPES[0] };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Server>({ defaultValues, resolver: zodResolver(ServerSchema), reValidateMode: 'onBlur' });

  const onSubmit: SubmitHandler<Server> = (data: Server) => {
    props.onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <ListRow className="items-center">
        <Radio name="selected" disabled />
        <div>
          <QBittorrentIcon className="size-10 rounded-box" />
        </div>
        <ListColGrow>
          <Label title="name" type="input" className="text-sm uppercase font-semibold" color={errors.name && 'error'}>
            <Input {...register('name')} />
          </Label>
        </ListColGrow>

        <ListColWrap className="">
          <div className="text-xs uppercase font-semibold">
            <Label title="client" type="select">
              <Select size="sm" {...register('type')}>
                {SERVER_TYPES.map(type => (
                  <SelectOption value={type} key={type}>
                    {type}
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

const EditItem = ({ item, onSubmit }: { item?: Server; onSubmit: (data: Server) => void }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<Server>({ defaultValues: item });

  const [name, ssl] = watch(['name', 'ssl']);
  const debounce = useDebouncedCallback(
    handleSubmit(data => onSubmit(data)),
    300,
  );

  useEffect(() => {
    if (name === item?.name) return;
    reset(item);
  }, [item, name, reset]);

  return (
    <Form className="flex flex-col gap-4" onChange={debounce}>
      <Label title="Name">
        <Input {...register('name')} color={errors.name && 'error'} />
      </Label>
      <Label title="Type">
        <Select size="sm" {...register('type')} disabled>
          {SERVER_TYPES.map(type => (
            <SelectOption value={type} key={type}>
              {type}
            </SelectOption>
          ))}
        </Select>
      </Label>

      <div className="flex gap-2 items-center">
        <Label title={`http${ssl ? 's' : ''}://`} type="input" color={errors.host && 'error'}>
          <Input {...register('host')} />
        </Label>
        <Label title="SSL">
          <Checkbox {...register('ssl')} type="number" color={errors.ssl && 'error'} />
        </Label>
      </div>

      <Label title="Username">
        <Input {...register('username')} color={errors.username && 'error'} placeholder="Username" />
      </Label>
      <Label title="Password">
        <Input {...register('password')} color={errors.password && 'error'} type="password" />
      </Label>
    </Form>
  );
};
