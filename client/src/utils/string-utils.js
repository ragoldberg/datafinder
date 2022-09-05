const isString = (val) => typeof val === 'string' || val instanceof String;

const isBlank = (str) => {
    if (!str) return true;
    // @ts-ignore
    return isString(str) && str.trim() === ''
};


const formatDocument = (document) => {
    if (isBlank(document)) return document;

    document = document?.trim();

    if (document?.length === 11) return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (document?.length === 14) return document.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5");
    else if (document?.length === 6) return document.replace(/^(\d{3})?(\d{3})/, "$1.$2-");
    else if (document?.length === 7) return document.replace(/^(\d{6})?(\d{1})/, "$1-$2");
    else if (document?.length === 8) return document.replace(/^(\d{5})?(\d{3})/, "$1-$2");
  
    return document;
};



export {
    isBlank,
    isString,
    formatDocument
    
}