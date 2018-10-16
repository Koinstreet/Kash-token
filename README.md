# Koin Street's KASH And AirDrop

<img src="Koinstreet.png" width="250" height="250">

## 1. What is KASH and Its Airdrop

The KASH contract is a standard ERC20 token. It is the token used within the Koin Street.

The Airdrop is our way of rewarding early adopters and seeding the Koin Street ecosystem with a free distribution of KASH, no strings attached. During the Airdrop, the first 100,000 people to sign up will be able to claim a free KASH deposit to their Koin  wallet, with no need to stake or deposit any of their own funds to participate.

## 2. How does it work?

Just by signing up with an email address and enabling 2-factor authentication (2FA), the first 100k adopters will be able to claim KASH in the Airdrop. Once the Airdrop closes, people are then free to hold the KASH in their Koin Street wallet, trade it on an exchange, and send it to other Koin Street users or any ERC20 compatible wallet. In the future, Koin Street holders will also be able to spend KASH at verified merchants and receive a 5% bonus on every transaction.

## 3. Why do an Airdrop?

Airdrops are often used by blockchain companies as an alternative to (or in addition to) conducting an ICO or token sale. Especially in cases where crowdfunding a project is not necessary, airdrops allow tokens to be publicly distributed without requiring people to "buy in" with their own funds.

By offering KASH freely to anyone with an email address and phone number, we can align our distribution model with our core philosophy of open access and democratization, while also achieving the widest possible dissemination of KASH.

Learn more about why we're conducting an airdrop [here](https://medium.com/koinstreet/why-airdrop).

Pre-enroll in the airdrop by [signing up](https://www.koinstreet.com/signup/) now and activating 2-factor authentication. You'll receive a notification when the Airdrop starts and you can sign in and claim your KASH.

## 4. Airdrop Statistics:

Total Airdrop Distribution: 100 million tokens
Tokens per registered user: 1000
Airdrop value: TBD based on opening exchange value
Start date: November 2018
End date: Upon completion of total Airdrop distribution

### Smart Contracts

-   Airdropper.sol

This contract distributes KASH in the token's initial distribution phase. The first 100 thousand Koin Street citizens receive 1000 KASH.

`triggerAirDrop` is the main function that distributes tokens to recipient addresses. You pass a recipient and she gets the KASH tokens. A user who claimed their KASH airdropped tokens cannot do so again.

-   KASH.sol

Standard ERC20 token contract. It possesses the [ERC20 functions](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md).

## 5. Development

**Dependencies**

-   `node@9.5.x`

**Setting Up**

-   Clone this repository.

-   Install all [system dependencies](#development).

    -   `npm install`

-   Compile contract code

    -   `node_modules/.bin/truffle compile`

**Running Tests**

-   `npm run test`

**Test Coverage**

To see current test coverage, open `coverage/index.html` in a browser.

To generate test coverage, type:

-   `npm run cov`

**Generate Flattened Contracts**

To generate flattened version of contracts in `flats/`, type:

-   `npm run flat`

To generate flatten version of contracts and serve them to remix, type:

-   install `remixd` with `npm -g remixd`

-   `npm run remix`

## 6. Licensing

Koinstreet is licensed under the [GNU AFFERO GENERAL PUBLIC LICENSE](https://www.gnu.org/licenses/agpl-3.0.en.html) (agpl-3.0) license.

## 7. What is the Koin Street?

Koin Street's mission is to advance the development of blockchain technologies, to promote human rights and empowerment around the globe, and to reduce the global digital divide.

In support of this mission, the Koin Street is responsible for the following activity:

-   Developing open-source distributed ledger technologies (DLT)
-   Developing self-sovereign identity technologies (SSI)
-   Creating and distributing educational content on the subjects of digital security, privacy, and blockchain technology.
-   Maintaining and managing the KASH token and reserve, and all Koin Street smart contracts.
-   Incubating and seeding initiatives, businesses, and non-profit organizations that utilize KASH and/or its underlying open-source technologies in their daily operations.

Currently the Koin Street is developing an ecosystem of platforms on the Ethereum blockchain, combining solutions for both big data and economic agency (KASH token and Koinstreet social trading network).

## 8. Learn More

To learn more about Koin Street, visit the [Koin Street website](https://www.koinstreet.com/), [blog](www.medium.com/Koinstreet), and on Twitter at [@Koinstreet](www.twitter.com/Koinstreet).
