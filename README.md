<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
<!-- [![Forks][forks-shield]][forks-url] -->


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#roadmap">Roadmap</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

### Overview 

Prattlr is a multi-chat application that allows streamers to connect with their viewers accross Twitch and YouTube. It is **NOWHERE NEAR** production ready, but it is a work in progress.

<img src="README/chat-preview.png" alt="chat screenshot" width="50%">

### Built With

* [Next.js](https://nextjs.org/)
* [Astro](https://astro.build/)
* [React](https://reactjs.org/)
* [Firebase](https://firebase.google.com/)
* [Socket.IO](https://socket.io/)
* [twurple](https://twurple.js.org/)

### Roadmap
- [x] Create chat front end
- [x] Integrate with Twitch.tv chat
- [x] Integrate with YouTube chat
- [ ] Add Firebase authentication
- [ ] Add Firebase database for chat logs
- [ ] Add moderation tools
- [ ] Add chat commands
- [ ] Add custom emotes


<p align="right">(<a href="#top">back to top</a>)</p>

## Usage
1. Clone the repo
    ```bash
    git clone https://github.com/DavidAngell/Prattlr
    cd Prattlr
    ```

2. Create server/src/credentials.ts
    ```ts
    import { ClientCredentialsAuthProvider } from '@twurple/auth';

    export const YOUTUBE_API = "api_key"
    export const YOUTUBE_CHANNEL_ID = "channel_id"

    const TWITCH_CLIENT_ID = 'client_id';
    const TWITCH_CLIENT_SECRET = 'client_secret';

    export const TWITCH_AUTH_PROVIDER = new ClientCredentialsAuthProvider(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);
    ```

3. Start the server
    ```bash
    cd server
    npm run start
    ```

4. Start the client
    ```bash
    cd client
    npm run dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser of choice

<p align="right">(<a href="#top">back to top</a>)</p>
    

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "i did john's mom".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

David Angell - [@DavidJAngell42](https://twitter.com/DavidJAngell42) - contact@davidangell.dev

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [This Legend](https://www.youtube.com/watch?v=dQw4w9WgXcQ)


<div align="center">
	<br />
	<a href="https://paypal.me/davidjangell" align="center" target="_blank">
		<img src="https://viatesting.files.wordpress.com/2020/03/paypal-donate-button.png" 
  			width="200"
 		/>
	</a>
</div>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/DavidAngell/Viewers-Control.svg?style=for-the-badge
[contributors-url]: https://github.com/DavidAngell/Viewers-Control/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/DavidAngell/Viewers-Control.svg?style=for-the-badge
[forks-url]: https://github.com/DavidAngell/Viewers-Control/network/members
[stars-shield]: https://img.shields.io/github/stars/DavidAngell/Viewers-Control.svg?style=for-the-badge
[stars-url]: https://github.com/DavidAngell/Viewers-Control/stargazers
[issues-shield]: https://img.shields.io/github/issues/DavidAngell/Viewers-Control.svg?style=for-the-badge
[issues-url]: https://github.com/DavidAngell/Viewers-Control/issues
[license-shield]: https://img.shields.io/github/license/DavidAngell/Viewers-Control.svg?style=for-the-badge
[license-url]: https://github.com/DavidAngell/Viewers-Control/blob/master/LICENSE.txt