import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/notifications')({
  component: Notifications,
});

function Notifications() {
  return (
    <table>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="linksfoundindicator">Address bar indicator</label>
          </span>
        </td>
        <td>
          <input type="checkbox" id="linksfoundindicator" />
          <br />
          <span className="tip">
            Enabling this will cause an indicator icon to appear in every page's address bar where the extension found
            torrent links matching the filters defined in &quot;Link Catching&quot;
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="showpopups">Popups</label>
          </span>
        </td>
        <td>
          <input type="checkbox" id="showpopups" />
          <br />
          <span className="tip">Enable this to view success/error messages as desktop notification popups</span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="hearpopups">Audible Notifications</label>
          </span>
        </td>
        <td>
          <input type="checkbox" id="hearpopups" />
          <br />
          <span className="tip">Enable this to hear a sound when notifications appear</span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="popupduration">Popup Duration</label>
          </span>
        </td>
        <td>
          <input type="text" id="popupduration" /> msec
          <br />
          <span className="tip">Duration of time until the popups are removed</span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="notificationtest">Test it</label>
          </span>
        </td>
        <td>
          <button id="notificationtest">hit me</button>
        </td>
      </tr>
    </table>
  );
}
