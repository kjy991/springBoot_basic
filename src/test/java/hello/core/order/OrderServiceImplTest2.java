package hello.core.order;

import hello.core.discount.FixDiscountPolicy;
import hello.core.discount.RateDiscountPolicy;
import hello.core.member.Grade;
import hello.core.member.Member;
import hello.core.member.MemoryMemberRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class OrderServiceImplTest2 {

    @Test
    void createOrder(){
        MemoryMemberRepository memberRepository = new MemoryMemberRepository();
        memberRepository.save(new Member(1L,"YeopKing", Grade.VIP));

        OrderServiceImpl orderService = new OrderServiceImpl(memberRepository,new RateDiscountPolicy());
        Order order = orderService.createOrder(1L, "item", 100000);

        assertThat(order.getDiscountPrice()).isEqualTo(10000);
    }
}
