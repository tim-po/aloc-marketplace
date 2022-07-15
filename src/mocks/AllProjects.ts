type AllProjectsDict = {[key: string]: {name: string, description: string, creativeLink: string}}

export const AllProjects: AllProjectsDict = {
  bitpay: {
    name: "Bitpay",
    description: "World's largest crypto payment processor",
    creativeLink: '/creative/Bitpay_comp.mp4'
  },
  metamask: {
    name: "Metamask",
    description: "Owner of Metamask wallet, blockchain infrastructure developer",
    creativeLink: '/creative/Metamask_comp.mp4'
  },
  kraken: {
    name: "Kraken",
    description: "Fastest growing crypto exchange",
    creativeLink: '/creative/Kraken_comp.mp4'
  },
  ledger: {
    name: "Ledger",
    description: "Dominating hardware crypto wallet developer",
    creativeLink: '/creative/Ledger_comp.mp4'
  },
}