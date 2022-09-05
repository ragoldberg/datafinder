/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-anonymous-default-export
import { Tooltip } from "antd";

import InputMask from "react-input-mask";
export const cnpjMask = (value) => {
  return value
    .replace(/\D+/g, "") // não deixa ser digitado nenhuma letra
    .replace(/(\d{2})(\d)/, "$1.$2") // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2") // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1"); // captura os dois últimos 2 números, com um - antes dos dois números
};

export const Info_adicional = (autuacoes) => {
  if (autuacoes === "PCD") {
    return (
      <Tooltip title="Autuado na Lei de cotas 8.213/91" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "Nenhuma") {
    return (
      <Tooltip title="Nenhuma Autuação Governamental" color="green">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "green",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "beneficio_sim") {
    return (
      <Tooltip title="Empresa Beneficiada pelo Governo Federal" color="yellow">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "yellow",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "beneficio_nao") {
    return (
      <Tooltip title="Sem Beneficios Governamentais" color="grey">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "grey",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "sem_sancao") {
    return (
      <Tooltip title="Sem Sanções Governamentais" color="green">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "green",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "com_sancao") {
    return (
      <Tooltip
        title="Existem Sancoes Governamentais neste CNPJ / CPF "
        color="red"
      >
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "acordo_leniencia_nao") {
    return (
      <Tooltip title="Sem Acordos de Leniência" color="green">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "green",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "acordo_leniencia_sim") {
    return (
      <Tooltip title="Existem acordos de Leniência vigentes" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "esfl_impedidas_nao") {
    return (
      <Tooltip title="Sem impedimentos" color="green">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "green",
          }}
        ></div>
      </Tooltip>
    );
  } else if (autuacoes === "esfl_impedidas_sim") {
    return (
      <Tooltip title="Empresa Sem Fim Lucrativo Impedida" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  }

  return autuacoes;
};
export const sit_cad = (sitcad) => {
  if (sitcad === "Ativa") {
    return (
      <Tooltip title="Ativa" color="green">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "green",
          }}
        ></div>
      </Tooltip>
    );
  } else if (sitcad === "Baixada") {
    return (
      <Tooltip title="Baixada" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  } else if (sitcad === "Inapta") {
    return (
      <Tooltip title="Inapta" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  } else if (sitcad === "Nula") {
    return (
      <Tooltip title="Nula" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  } else if (sitcad === "Suspensa") {
    return (
      <Tooltip title="Nula" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "gold",
          }}
        ></div>
      </Tooltip>
    );
  }

  return sitcad;
};
export const mat_fil = (matfil) => {
  if (matfil === "Matriz") {
    return (
      <Tooltip title="Matriz" color="#6D94F3">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "#6D94F3",
          }}
        ></div>
      </Tooltip>
    );
  } else if (matfil === "Filial") {
    return (
      <Tooltip title="Filial" color="gray">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "gray",
          }}
        ></div>
      </Tooltip>
    );
  }

  return matfil;
};

export const ranking = (status) => {
  if (status === "100") {
    return {
      number: "100",
      backgroundColor: "#6fc62bcc",
    };
  } else if (status === "75") {
    return {
      number: "75",
      backgroundColor: "#99ca27c5",
    };
  } else if (status === "50") {
    return {
      number: "50",
      backgroundColor: "#d4b030cc",
    };
  } else if (status === "25") {
    return {
      number: "25",
      backgroundColor: "red",
    };
  } else if (status === "0") {
    return {
      number: "0",
      backgroundColor: "#683a3acc",
    };
  }

  return status;
};

export const date = (date) => {
  return date.split("-").reverse().join("/");
};

export const e_mei = (ismei) => {
  if (ismei === "S") {
    return (
      <div
        style={{
          color: "red",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        Sim{" "}
      </div>
    );
  } else if (ismei === "N") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "left",
        }}
      >
        {" "}
        Não{" "}
      </div>
    );
  }

  return ismei;
};

export const tem_div = (temdivida) => {
  if (temdivida == 0) {
    return (
      <Tooltip title="Sem dívidas" color="green">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "green",
          }}
        ></div>
      </Tooltip>
    );
  } else if (temdivida == 1) {
    return (
      <Tooltip title="Divida Ativa" color="red">
        <div
          className="cnpj_status_circle"
          style={{
            backgroundColor: "red",
          }}
        ></div>
      </Tooltip>
    );
  }

  return temdivida;
};

export const tipodivida_extenso = (tipodivida) => {
  if (tipodivida === "Regular") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "green",
        }}
      >
        Regular
      </div>
    );
  } else if (tipodivida === "Irregular") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "red",
        }}
      >
        Irregular
      </div>
    );
  }

  return tipodivida;
};

export const numberFormat = (value) => {
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const convertMoneyValue = (number, element) => {
  number = parseFloat(number / 100).toFixed(2);
  element.value = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);
};

export const arrumatexto = (string) => {
  if (!string) return null;
  return string.replace(/\S*/g, function (word) {
    return word.charAt(0) + word.slice(1).toLowerCase();
  });
};

export const arrumatexto_1 = (argument) => {
  return argument.replace(/\S*\w+/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
};

export const PhoneInput = (props) => {
  return (
    <InputMask
      mask="(+55 99) 9999-99999"
      value={props.value}
      onChange={props.onChange}
    ></InputMask>
  );
};

export const CNPJinput = (props) => {
  return (
    <InputMask
      mask="99.999.999/9999-99"
      value={props.value}
      onChange={props.onChange}
    ></InputMask>
  );
};

export const mat_fil_extenso = (matfil) => {
  if (matfil === "Matriz") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "#6D94F3",
        }}
      >
        Matriz
      </div>
    );
  } else if (matfil === "Filial") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "gray",
        }}
      >
        Filial
      </div>
    );
  }

  return matfil;
};

export const sit_cad_extenso = (sitcad) => {
  if (sitcad === "Ativa") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "#89CF53",
        }}
      >
        Ativa
      </div>
    );
  } else if (sitcad === "Baixada") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "red",
        }}
      >
        Baixada
      </div>
    );
  } else if (sitcad === "Inapta") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "red",
        }}
      >
        Inapta
      </div>
    );
  } else if (sitcad === "Nula") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "red",
        }}
      >
        Nula
      </div>
    );
  } else if (sitcad === "Suspensa") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          backgroundColor: "gold",
        }}
      >
        Suspensa
      </div>
    );
  }

  return sitcad;
};

export const beneficios_cpf = (cpf) => {
  if (cpf === "Beneficiado Bolsa Fam") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          color: "red",
        }}
      >
        Beneficiado Bolsa Fam
      </div>
    );
  } else if (cpf === "Beneficiado Aux. Emer.") {
    return (
      <div
        className="cnpj_status_label"
        style={{
         
          color: "red",
        }}
      >
       Beneficiado Aux. Emer.
      </div>
    );
  }else if (cpf === "Beneficiado Aux. Emer. e Bolsa Fam") {
    return (
      <div
        className="cnpj_status_label"
        style={{
         
          color: "red",
        }}
      >
       Beneficiado Aux. Emer. e Bolsa Fam
      </div>
    );
  }else if (cpf === "Nao Beneficiado") {
    return (
      <div
        className="cnpj_status_label"
        style={{
         
          color: "Black",
        }}
      >
       Sem Beneficios Gov.
      </div>
    );
  }






  return beneficios_cpf;
};

export const pessoa_publica = (pessoa) => {
  if (pessoa !== "") {
    return (
      <div
        className="cnpj_status_label"
        style={{
          color: "blue",
        }}
      >
        {pessoa}
      </div>
    );
  }else if (pessoa === "*") {
    return (
      <div
        className="cnpj_status_label"
        style={{
         
          color: "Black",
        }}
      >
      {pessoa}
      </div>
    );
  }
  

  return pessoa;
};


export default {
  cnpjMask,
  Info_adicional,
  sit_cad,
  mat_fil,
  ranking,
  date,
  e_mei,
  tem_div,
  numberFormat,
  arrumatexto,
  arrumatexto_1,
  CNPJinput,
  PhoneInput,
  mat_fil_extenso,
  sit_cad_extenso,
  convertMoneyValue,
  tipodivida_extenso,
  beneficios_cpf,
  pessoa_publica,
};
