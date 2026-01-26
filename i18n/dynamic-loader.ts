// Dynamic Translation Loader
export async function loadTranslation(locale: string) {
  try {
    const translation = await import(`./locales/${locale}.json`);
    return translation.default;
  } catch (error) {
    console.warn(`Translation not found for ${locale}, falling back to English`);
    return null;
  }
}

export async function loadModules(locale: string) {
  try {
    const modules = await import(`./locales/${locale}-modules.json`);
    return modules.default;
  } catch (error) {
    console.warn(`Modules not found for ${locale}, falling back to English`);
    return null;
  }
}
