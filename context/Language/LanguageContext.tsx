import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";
import { createUrl, subDomains } from "../../components/helper/country";


type languageType = {
  language: string;
  shortTerm:string;
  imageUrl: string;
};

const availableLanguages: Record<string, languageType> = {
  en: { language: "English",shortTerm:"en", imageUrl: subDomains.GBR, },
  ger: { language: "German",shortTerm:"de", imageUrl: subDomains.DEU },
};

type languageContextType = {
  selectedLanguage: languageType;
  allLanguages: Record<string, languageType>;
  changeLanguage: (language: string) => void;
};

const languageContextDefaultValues: languageContextType = {
  selectedLanguage: availableLanguages["en"],
  allLanguages: availableLanguages,
  changeLanguage: (language: string) => {},
};

const LanguageContext = createContext<languageContextType>(
  languageContextDefaultValues
);

export function useLanguage() {
  return useContext(LanguageContext);
}

type Props = {
  children: ReactNode;
};

export function LanguageProvider({ children }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages["en"]
  );

  const changeLanguage = (language: string) => {
    setSelectedLanguage(availableLanguages[language]);
  };



  const value = {
    selectedLanguage,
    allLanguages:availableLanguages,
    changeLanguage,
  };

  return (
    <>
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    </>
  );
}
