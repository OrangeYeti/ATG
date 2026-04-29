window.ATG_CONFIG = {
  defaultLocale: "ko",
  locales: [
    { code: "ko", label: "KO", active: true },
    { code: "en", label: "EN", active: false },
    { code: "zh", label: "中文", active: false }
  ],
  assets: {
    logos: {
      master: "assets/logos/brand/logo-master.png",
      horizontal: "assets/logos/brand/logo-horizontal.png",
      favicon: "assets/logos/brand/logo-favicon.png",
      monoDark: "assets/logos/brand/logo-mono-dark.png",
      monoLight: "assets/logos/brand/logo-mono-light.png",
      monoReverse: "assets/logos/brand/logo-mono-reverse.png",
      main: "assets/logos/brand/logo-horizontal.png",
      astWide: "assets/logos/logo-ast-wide.png",
      astSquare: "assets/logos/logo-ast-square.png"
    },
    favicons: {
      favicon32: "assets/logos/brand/logo-favicon.png",
      appleTouchIcon: "assets/logos/brand/logo-favicon.png",
      manifest: "assets/favicons/site.webmanifest"
    },
    docs: {
      companyProfile: {
        href: "assets/docs/AY-Tech-Global-Company-Profile-KR.pdf",
        fileName: "AY-Tech-Global-Company-Profile-KR.pdf",
        label: "AY Tech Global Company Profile"
      }
    },
    media: {
      about: "",
      ceoProfile: "assets/images/profile-ceo.png",
      network: "",
      cases: ["", "", ""]
    }
  },
  form: {
    endpoint: "",
    method: "POST",
    recipientEmail: "ayt@aytech-global.com",
    subjectPrefix: "[AY TECH GLOBAL 문의]"
  }
};
