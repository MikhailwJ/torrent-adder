import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/link-catching')({
  component: LinkCatching,
});

function LinkCatching() {
  return (
    <table>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="catchfromcontextmenu">Context menu</label>
          </span>
        </td>
        <td>
          <input type="checkbox" id="catchfromcontextmenu" />
          <br />
          <span className="tip">
            Enable this to add a context menu entry for links. You must restart for this setting to take effect.
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="catchfrompage">Clicks on links</label>
          </span>
        </td>
        <td>
          <input type="checkbox" id="catchfrompage" />
          <br />
          <span className="tip">
            Enable this to intercept links from pages where torrent links were found and automatically send them to the
            WebUI instead of downloading them locally (can be overridden by holding CTRL/ALT/SHIFT).
          </span>
          <br />
          <div style={{ float: 'left' }}>
            <select id="linkmatches"></select>
          </div>
          <div style={{ position: 'relative', float: 'left' }}>
            <button id="addfilterbtn">+</button>
            <br />
            <button id="delfilterbtn">-</button>
            <br />
            <button id="showfiltersbtn">~</button>
          </div>
          <br style={{ clear: 'both' }} />
          <span className="tip">
            Creating new filters is easy; just look at a sample link that you want matched, remove parts of it as long
            as it still resembles a link scheme specific to your torrent site, then follow these rules:
            <br />
            - escape (put a backslash in front of) every: &quot;.&quot;, &quot;/&quot;, &quot;?&quot;
            <br />
            - replace dynamic parts: (&quot;\d+&quot; matches any number, e.g. torrent ID, &quot;.+?&quot; matches any
            character, &quot;[:alpha:]&quot; matches any string containing letters or numbers)
            <br />
            <a target="_blank" href="http://www.regular-expressions.info/reference.html">
              more detailed information
            </a>
          </span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="catchfromnewtab">New tab</label>
          </span>
        </td>
        <td>
          <input type="checkbox" id="catchfromnewtab" />
          <br />
          <span className="tip">Enable this to have RTA grab links from newly opened tabs.</span>
        </td>
      </tr>
      <tr>
        <td>
          <span className="title">
            <label htmlFor="registerDelay">Scan delay</label>
          </span>
        </td>
        <td>
          <input type="text" id="registerDelay" />
          ms
          <br />
          <span className="tip">
            This will delay RTA's link scanning after the page loads. Useful for pages that generate torrent links
            dynamically.
          </span>
        </td>
      </tr>
    </table>
  );
}
