interface Field {
  id: Number;
  label: String;
  type: String;
  required?: Boolean;
  options?: String[];
  default?: Boolean;
}

interface Section {
  id: String;
  title: String;
  fields: Field[];
}

export interface Schema {
  id: String;
  title: String;
  icon: String;
  sections: Section[];
}
