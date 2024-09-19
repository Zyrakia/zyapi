type HandlerType<ResponseSchema, RequestSchema> = { response: ResponseSchema; request: RequestSchema };

declare type Routes = {
	'/': {};
	'/status': {
		get: HandlerType<
			{
				version: string;
			},
			never
		>;
	};
	'/hue': {};
	'/hue/toggle': {};
	'/projects/[id]': {};
	'/projects': {};
	'/tech/[id]': {};
	'/tech': {};
	'/user/[id]': {};
};
