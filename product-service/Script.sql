create extension if not exists "uuid-ossp";
create table if not exists products (
  id uuid not null default uuid_generate_v4() primary key,
  title text not null default '',
  description text,
  price int not null default 0
);

create table if not exists stocks (
  product_id uuid not null references products(id),
  count int 
);

insert into products (id, title,description,price) values ('2ba4983c-6678-4f20-95f1-b1adbe8fe738', 'test product one', 'this is an excptinoal product 1', 12), ('baddb897-f6aa-45d4-bb3c-844dbc8173b2','test product two', 'this is an excptinoal product 2', 15), ('f3ac8026-16b9-47b1-bd87-49f505f57215','test product three', 'this is an excptinoal product 3', 16);

insert into stocks (product_id, count) values ('2ba4983c-6678-4f20-95f1-b1adbe8fe738',12), ('baddb897-f6aa-45d4-bb3c-844dbc8173b2', 15), ('f3ac8026-16b9-47b1-bd87-49f505f57215', 16);