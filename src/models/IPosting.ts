interface IPosting {
	title: string;
	price: number;
	category: string;
	description: string;
	images: IPostingImages[];
	name: string;
	phone: number;
	state: string;
	city: string;
}

export interface IPostingImages {
	path: string;
}

export default IPosting;