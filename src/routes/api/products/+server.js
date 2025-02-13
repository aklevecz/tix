import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	/** @type {Product[]} */
    const mockProducts = [
        {
            id: '101',
            projectId: '201',
            name: 'Vintage Leather Wallet',
            title: 'Handcrafted Leather Wallet',
            description: 'A premium handcrafted leather wallet with multiple compartments and RFID protection.',
            price: 4999,
            date: '2024-02-01',
            img: 'https://placehold.co/600x400?text=Leather+Wallet'
        },
        {
            id: '102',
            projectId: '202',
            name: 'Noise-Canceling Headphones',
            title: 'Wireless Over-Ear Headphones',
            description: 'Experience immersive sound with these high-fidelity noise-canceling wireless headphones.',
            price: 19999,
            date: '2024-01-15',
            img: 'https://placehold.co/600x400?text=Headphones'
        },
        {
            id: '103',
            projectId: '203',
            name: 'Smartwatch Pro X',
            title: 'Advanced Fitness Smartwatch',
            description: 'Track your fitness goals with this smartwatch featuring heart rate monitoring and GPS tracking.',
            price: 24999,
            date: '2024-02-10',
            img: 'https://placehold.co/600x400?text=Smartwatch'
        },
        {
            id: '104',
            projectId: '204',
            name: 'Ergonomic Office Chair',
            title: 'Adjustable Mesh Office Chair',
            description: 'Stay comfortable with this ergonomic office chair featuring lumbar support and adjustable armrests.',
            price: 15999,
            date: '2024-01-20',
            img: 'https://placehold.co/600x400?text=Office+Chair'
        },
        {
            id: '105',
            projectId: '205',
            name: 'Portable Espresso Maker',
            title: 'Compact Manual Coffee Maker',
            description: 'Enjoy rich espresso anywhere with this travel-friendly manual coffee maker.',
            price: 8999,
            date: '2024-02-05',
            img: 'https://placehold.co/600x400?text=Espresso+Maker'
        }
    ];
    

	return json(mockProducts);
}
