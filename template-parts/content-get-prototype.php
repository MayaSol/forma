<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package forma
 */

?>



<article id="post-<?php the_ID(); ?>" <?php post_class('get-prototype'); ?>>


  <div class="get-prototype__img">
    <div class="get-prototype__img-inner js-tilt" data-tilt>
      <img src="<?php bloginfo('template_url'); ?>/img/logo-new.png" alt="Logotype image">
    </div>
  </div>

  <div class="get-prototype__form get-prototype-form">
    <div class="get-prototype-form__inner">
      <?php
        the_content();
      ?>
      <div class="link-home-wrapper">
        <a class="link-home" href="https://kinacircle.com">Visit our Home Page</a>
      </div>
    </div>
  </div><!-- .entry-content -->

</article><!-- #post-<?php the_ID(); ?> -->
