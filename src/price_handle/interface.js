export const idlFactory = ({ IDL }) => {
	const PriceData = IDL.Record({
	  'signature' : IDL.Text,
	  'provider' : IDL.Text,
	  'asset' : IDL.Nat32,
	  'timestamp' : IDL.Text,
	  'is_closed' : IDL.Bool,
	  'price' : IDL.Text,
	});
	return IDL.Service({
	  'add_data' : IDL.Func([IDL.Nat32, PriceData], [IDL.Bool], []),
	  'add_node' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Principal)], []),
	  'get_caller' : IDL.Func([], [IDL.Principal], ['query']),
	  'get_data' : IDL.Func([IDL.Nat32], [IDL.Vec(PriceData)], ['query']),
	  'get_nodes' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
	  'get_owner' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
	  'remove_node' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Principal)], []),
	});
};

export const canisterId = "ffs6z-fyaaa-aaaao-aai6q-cai";
export const init = ({ IDL }) => { return []; };