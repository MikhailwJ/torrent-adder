import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: Settings,
});

function Settings() {
  return (
    <table>
      <tr>
        <td>
          <span className="title">Create a backup</span>
        </td>
        <td>
          <button id="createBackupButton">Export settings</button>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">Import a backup</span>
        </td>
        <td>
          <input id="importBackupSelector" type="file" />
          <br />
          <div id="importResultField"></div>
        </td>
      </tr>
    </table>
  );
}
