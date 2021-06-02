import { User } from '../../entities/User';
import { MailProvider } from '../../providers/MailProvider';
import { UsersRepository } from '../../repositories/UsersRepository';
import { CreateUserRequestDTO } from './CreateUserDTO';

export class CreateUserUseCase {
    constructor(private usersRepository: UsersRepository, private mailProvider: MailProvider) {}
    
    async execute(data: CreateUserRequestDTO) {
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExists) {
            throw new Error('User already exists.');
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email
            },
            from: {
                name: 'Marven Solutions',
                email: 'marven.solutions@no-reply.com'
            },
            subject: 'Welcome to our System',
            body: '<p>Now you can log in on our application.</p>'
        });
    }
}