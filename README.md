# Jane Client downloads

Public installers for Jane Client. The client source repository remains private.

[Download Jane Client 2.2.1](https://github.com/ImAKitchenAplliance/Jane-Client-Download/releases/tag/v2.2.1)

Choose a `.deb` for Linux Mint 22.x, an AppImage for compatible Linux, or a Windows x64 setup/portable executable. Java installs automatically. Windows executables are unsigned. Do not download the automatically generated Source code ZIP to install the client.

The Right Shift menu supports Fabric and NeoForge on Minecraft 1.21, 1.21.1 and 1.21.2. NeoForge 1.21.2 uses its official beta loader. See SHA256SUMS for download verification.

## Website: free Cloudflare Pages hosting

Download `jane-website.zip` from the release assets. In Cloudflare, open Workers & Pages → Create application → Pages → Direct Upload. Choose a project name, upload the ZIP and deploy. Cloudflare supplies a free HTTPS `*.pages.dev` address; you do not need to purchase a domain. Upload only this website ZIP, never the private client source repository.

The archive includes only static website files, font and first-party illustrations. Its download buttons link to this repository's public installer assets. Publishing the site does not publish the client source.

## Reporting problems

Use this repository's Issues tab. Include your operating system, Minecraft version, loader and the relevant error. Remove credentials and tokens before sharing logs.

The publishing workflow copies only verified, prebuilt installer assets using temporary signed asset URLs. It never checks out the private client source. GitHub's generated Source code archive contains only this public download site's supporting files.
