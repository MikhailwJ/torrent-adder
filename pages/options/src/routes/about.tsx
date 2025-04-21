import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return (
    <table>
      <tr>
        <td>
          <span className="title">About the extension</span>
        </td>
        <td>
          This extension lets you silently add torrent files to a BitTorrent client's web interface, either running on a
          remote server, or on your local computer. It lets you manually add torrents from a link's context menu, or can
          automatically find links that have torrents in them, using configurable regular expression filters, so that
          you only have to click on such a link to automatically load it into the configured client.
        </td>
      </tr>
      <tr>
        <td colSpan={2}>&nbsp;</td>
      </tr>
      <tr>
        <td>
          <span className="title">Info/FAQ/Changelog</span>
        </td>
        <td>
          Most non-bug related questions that arise in regard to this extension are about links that don't get caught.
          This extension finds these links through the use of regular expressions. A basic description on how to
          configure your own filters among other information can be found via this link:
          <br />
          <a target="_blank" href="https://github.com/bogenpirat/remote-torrent-adder/">
            https://github.com/bogenpirat/remote-torrent-adder/
          </a>
        </td>
      </tr>
      <tr>
        <td colSpan={2}>&nbsp;</td>
      </tr>
      <tr>
        <td>
          <span className="title">Problems/Bugs</span>
        </td>
        <td>
          If you find a bug, or have a feature request, please create an issue ticket on the project's GitHub issue
          tracker. This is the best route of reaching me:
          <br />
          <a target="_blank" href="https://github.com/bogenpirat/remote-torrent-adder/issues">
            Remote Torrent Adder GitHub Issue Tracker
          </a>
          <br />
          <br />
          For bugs, please supply the Google Chrome version you're using as well as a description of your behavior, the
          extension's misbehavior, what you were expecting to happen.
          <br />
          For new web interface support requests, please supply a link to the client's web site or its web interface
          documentation (or an alternative open source remote adding implementation).
        </td>
      </tr>
      <tr>
        <td colSpan={2}>&nbsp;</td>
      </tr>
      <tr>
        <td>
          <span className="title">Source code</span>
        </td>
        <td>
          The Git repository for this project will always contain the latest version of the source code of this
          extension. Feel free to clone it and send in pull requests if you think they're worth incorporating.
          <br />
          <a target="_blank" href="https://github.com/bogenpirat/remote-torrent-adder">
            Remote Torrent Adder GitHub project
          </a>
        </td>
      </tr>
      <tr>
        <td colSpan={2}>&nbsp;</td>
      </tr>
      <tr>
        <td>
          <span className="title">Mission Statement</span>
        </td>
        <td>
          This extension to the Google Chrome web browser was created to facilitate the easy (and possibly silent)
          adding of torrent files to BitTorrent clients' web interfaces. This improves on two minor downsides of the
          Google Chrome web browser as compared to the much more configurable and extensible Firefox web browser:
          <br />
          <br />
          At the time of the conception of this extension,
          <ol>
            <li>
              ... Google Chrome did not have the ability to automatically open downloaded files based on their file
              type. Thus, the act of adding a torrent file to a local BitTorrent client required additional, superfluous
              clicks. This extension reduces the amount of clicks to just the one click on the original web link.
            </li>
            <li>
              ... there was no Google Chrome extension performing the task that
              <a target="_blank" href="http://www.alexisbrunet.com/">
                Alexis Brunet
              </a>
              's BitTorrent WebUI Firefox Extension does. Its functionality, again easing the life of people who operate
              BitTorrent clients that are on remote servers, is done by removing unnecessary clicks from the process.
              The tedious sequence of downloading a torrent file, opening up the remote web interface, searching for and
              uploading the file is reduced to, again, one single click.
            </li>
          </ol>
          From a developer's standpoint, this extension has been written to be more or less plug and play. Support for
          each web interface is encapsulated in javascript functions, message passing between a content script that
          tracks torrent-links and the background script that does all the hard work facilitates all of the main
          functionality. Barely anything is commented, and there is next to no object orientation going on in the source
          code, so it's not the prettiest code. But since this started out mostly as a proof of concept to myself and
          most parts of it are either pretty self-explanatory, or hacked together using some rather new javascript
          methodologies (e.g. typed arrays), i don't see a reason to change that in the near future.
        </td>
      </tr>
    </table>
  );
}
